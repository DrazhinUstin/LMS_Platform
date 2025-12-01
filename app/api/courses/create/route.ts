import { getSession } from '@/app/lib/auth.get-session';
import { prisma } from '@/app/lib/prisma';
import { CourseSchema } from '@/app/lib/schemas';
import { stripe } from '@/app/lib/stripe';

export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session || session.user.role !== 'admin') {
      return new Response('Unauthorized!', {
        status: 401,
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

    const createdStripeProduct = await stripe.products.create({
      name: data.title,
      description: data.briefDescription,
      default_price_data: { currency: 'usd', unit_amount: data.price },
    });

    const createdCourse = await prisma.course.create({
      data: {
        ...data,
        stripeProductId: createdStripeProduct.id,
        stripePriceId: createdStripeProduct.default_price as string,
        authorId: session.user.id,
      },
    });

    return Response.json(createdCourse);
  } catch (error) {
    console.error(error);
    return new Response('Internal Server Error!', {
      status: 500,
    });
  }
}
