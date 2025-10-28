import { prisma } from '@/app/lib/prisma';
import { stripe } from '@/app/lib/stripe';
import { env } from '@/env';
import { headers } from 'next/headers';
import Stripe from 'stripe';

export async function POST(request: Request) {
  const body = await request.text();

  const headersList = await headers();

  const signature = headersList.get('stripe-signature') as string;

  const endpointSecret = env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (error) {
    console.error(error);
    return new Response('Webhook signature verification failed', { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const checkoutSession = event.data.object;

      const userId = checkoutSession.metadata?.userId;

      const courseId = checkoutSession.metadata?.courseId;

      if (!userId || !courseId) {
        return new Response('Incorrect checkout session metadata!', { status: 400 });
      }

      await prisma.enrollment.update({
        where: { userId_courseId: { userId, courseId } },
        data: { status: 'ACTIVE' },
      });
    }

    return new Response(null, {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response('Internal Server Error!', { status: 500 });
  }
}
