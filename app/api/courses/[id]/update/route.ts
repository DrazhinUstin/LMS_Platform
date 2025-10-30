import { auth } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';
import { CourseSchema } from '@/app/lib/schemas';
import { stripe } from '@/app/lib/stripe';
import { headers } from 'next/headers';
import Stripe from 'stripe';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return new Response('Unauthorized!', {
        status: 401,
      });
    }

    const { id } = await params;

    const course = await prisma.course.findUnique({
      where: { id },
      select: { id: true, stripeProductId: true, price: true, stripePriceId: true },
    });

    if (!course) {
      return new Response('Record not found!', {
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

    let newStripePrice: Stripe.Price | null = null;

    if (course.price !== validation.data.price) {
      newStripePrice = await stripe.prices.create({
        product: course.stripeProductId,
        currency: 'usd',
        unit_amount: validation.data.price,
      });
    }

    await stripe.products.update(course.stripeProductId, {
      name: validation.data.title,
      description: validation.data.briefDescription,
      ...(newStripePrice && { default_price: newStripePrice.id }),
    });

    if (newStripePrice) {
      await stripe.prices.update(course.stripePriceId, { active: false });
    }

    const updatedCourse = await prisma.course.update({
      where: { id: course.id },
      data: { ...validation.data, ...(newStripePrice && { stripePriceId: newStripePrice.id }) },
    });

    return Response.json(updatedCourse);
  } catch (error) {
    console.error(error);
    return new Response('Internal Server Error!', {
      status: 500,
    });
  }
}
