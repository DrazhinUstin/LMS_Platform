'use server';

import { auth } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';
import { stripe } from '@/app/lib/stripe';
import { env } from '@/env';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export async function enrollInCourse(courseId: string) {
  let checkoutUrl: string;

  try {
    const user = (
      await auth.api.getSession({
        headers: await headers(),
      })
    )?.user;

    if (!user) {
      throw new Error('Unauthorized!');
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { price: true, stripePriceId: true },
    });

    if (!course) {
      throw new Error('Course does not exist!');
    }

    const userWithStripeCustomerId = await prisma.user.findUnique({
      where: { id: user.id },
      select: { stripeCustomerId: true },
    });

    if (!userWithStripeCustomerId?.stripeCustomerId) {
      const createdCustomer = await stripe.customers.create({
        name: user.name,
        email: user.email,
        metadata: { userId: user.id },
      });

      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: createdCustomer.id },
      });
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: user.id, courseId } },
    });

    if (enrollment?.status === 'ACTIVE') {
      throw Error('Active enrollment already exist!');
    }

    checkoutUrl = await prisma.$transaction(async (tx) => {
      if (enrollment) {
        await tx.enrollment.update({
          where: { userId_courseId: { userId: user.id, courseId } },
          data: { status: 'PENDING' },
        });
      } else {
        await tx.enrollment.create({
          data: { userId: user.id, courseId, amount: course.price },
        });
      }

      const checkout = await stripe.checkout.sessions.create({
        line_items: [{ price: course.stripePriceId, quantity: 1 }],
        mode: 'payment',
        success_url: `${env.BETTER_AUTH_URL}/payments/success`,
        cancel_url: `${env.BETTER_AUTH_URL}/payments/cancel`,
        metadata: { userId: user.id, courseId },
      });

      return checkout.url as string;
    });
  } catch (error) {
    console.error(error);
    throw error;
  }

  redirect(checkoutUrl);
}
