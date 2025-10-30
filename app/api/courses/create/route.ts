import { auth } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';
import { CourseSchema } from '@/app/lib/schemas';
import { stripe } from '@/app/lib/stripe';
import { headers } from 'next/headers';

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
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

    const createdStripeProduct = await stripe.products.create({
      name: validation.data.title,
      description: validation.data.briefDescription,
      default_price_data: { currency: 'usd', unit_amount: validation.data.price },
    });

    const createdCourse = await prisma.course.create({
      data: {
        ...validation.data,
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
