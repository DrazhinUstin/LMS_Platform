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

export async function editReview(id: string, data: z.infer<typeof ReviewSchema>) {
  try {
    const session = await getSession();

    if (!session) {
      throw new Error('Unauthorized!');
    }

    const reviewToEdit = await prisma.review.findUnique({ where: { id } });

    if (!reviewToEdit) {
      throw new Error('Review does not exist!');
    }

    if (reviewToEdit.userId !== session.user.id) {
      throw new Error('Only the author of the review can edit the review!');
    }

    const validation = ReviewSchema.safeParse(data);

    if (!validation.success) {
      throw new Error('Invalid data!');
    }

    const editedReview = await prisma.$transaction(async (tx) => {
      const review = await tx.review.update({
        where: { id },
        data: validation.data,
      });

      const aggregations = await tx.review.aggregate({
        where: { courseId: review.courseId },
        _avg: { rating: true },
      });

      await tx.course.update({
        where: { id: review.courseId },
        data: { avgRating: aggregations._avg.rating },
      });

      return review;
    });

    revalidatePath('/courses');

    return editedReview;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteReview(id: string) {
  try {
    const session = await getSession();

    if (!session) {
      throw new Error('Unauthorized!');
    }

    const reviewToDelete = await prisma.review.findUnique({ where: { id } });

    if (!reviewToDelete) {
      throw new Error('Review does not exist!');
    }

    if (reviewToDelete.userId !== session.user.id) {
      throw new Error('Only the author of the review can delete the review!');
    }

    const deletedReview = await prisma.$transaction(async (tx) => {
      const review = await tx.review.delete({ where: { id } });

      const aggregations = await tx.review.aggregate({
        where: { courseId: review.courseId },
        _avg: { rating: true },
      });

      await tx.course.update({
        where: { id: review.courseId },
        data: { avgRating: aggregations._avg.rating },
      });

      return review;
    });

    revalidatePath('/courses');

    return deletedReview;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
