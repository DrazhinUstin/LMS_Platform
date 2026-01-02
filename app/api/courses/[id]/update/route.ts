import { getSession } from '@/app/lib/auth.get-session';
import { prisma } from '@/app/lib/prisma';
import { CourseSchema } from '@/app/lib/schemas';
import { stripe } from '@/app/lib/stripe';
import Stripe from 'stripe';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();

    if (!session || session.user.role !== 'admin') {
      return new Response('Unauthorized!', {
        status: 401,
      });
    }

    const { id } = await params;

    const course = await prisma.course.findUnique({
      where: { id, authorId: session.user.id },
      select: { id: true, stripeProductId: true, price: true, stripePriceId: true },
    });

    if (!course) {
      return new Response('Record not found or you are not authorized to update it!', {
        status: 404,
      });
    }

    const body = await request.json();

    const validation = CourseSchema.safeParse(body);

    if (!validation.success) {
      return new Response('Invalid request body!', {
        status: 400,
      });
    }

    const data: typeof validation.data = {
      ...validation.data,
      price: Math.round(validation.data.price * 100),
    };

    let newStripePrice: Stripe.Price | null = null;

    if (course.price !== data.price) {
      newStripePrice = await stripe.prices.create({
        product: course.stripeProductId,
        currency: 'usd',
        unit_amount: data.price,
      });
    }

    await stripe.products.update(course.stripeProductId, {
      name: data.title,
      description: data.briefDescription,
      ...(newStripePrice && { default_price: newStripePrice.id }),
    });

    if (newStripePrice) {
      await stripe.prices.update(course.stripePriceId, { active: false });
    }

    const updatedCourse = await prisma.course.update({
      where: { id: course.id },
      data: { ...data, ...(newStripePrice && { stripePriceId: newStripePrice.id }) },
    });

    return Response.json(updatedCourse);
  } catch (error) {
    console.error(error);
    return new Response('Internal Server Error!', {
      status: 500,
    });
  }
}
