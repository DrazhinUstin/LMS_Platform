'use server';

import { getSession } from '@/app/lib/auth.get-session';
import { prisma } from '@/app/lib/prisma';
import { ReviewSchema } from '@/app/lib/schemas';
import { revalidatePath } from 'next/cache';
import z from 'zod';

export async function createReview(courseId: string, data: z.infer<typeof ReviewSchema>) {
  try {
    const session = await getSession();

    if (!session) {
      throw new Error('Unauthorized!');
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        enrollments: { where: { userId: session.user.id }, select: { status: true } },
      },
    });

    if (!course) {
      throw new Error('Course does not exist!');
    }

    const isUserEnrolled = course.enrollments[0]?.status === 'ACTIVE';

    if (!isUserEnrolled) {
      throw new Error('User does not own the course to make the review!');
    }

    const validation = ReviewSchema.safeParse(data);

    if (!validation.success) {
      throw new Error('Invalid data!');
    }

    const createdReview = await prisma.$transaction(async (tx) => {
      const review = await tx.review.create({
        data: { userId: session.user.id, courseId, ...validation.data },
      });

      const aggregations = await tx.review.aggregate({
        where: { courseId },
        _avg: { rating: true },
      });

      await tx.course.update({
        where: { id: courseId },
        data: { avgRating: aggregations._avg.rating },
      });

      return review;
    });

    revalidatePath('/courses');

    return createdReview;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
