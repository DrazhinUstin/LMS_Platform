import 'server-only';
import { prisma } from '@/app/lib/prisma';
import { cache } from 'react';
import { reviewSelect, ReviewTypeWithSelect } from '@/app/data/review/get-reviews';

export const getReview = cache(
  async ({
    userId,
    courseId,
  }: {
    userId: string;
    courseId: string;
  }): Promise<ReviewTypeWithSelect | null> => {
    try {
      const review = await prisma.review.findUnique({
        where: { userId_courseId: { userId, courseId } },
        select: reviewSelect,
      });
      return review;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);
