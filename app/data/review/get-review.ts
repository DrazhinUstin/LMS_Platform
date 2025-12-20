import 'server-only';
import { prisma } from '@/app/lib/prisma';
import { cache } from 'react';
import { type ReviewSummary, reviewSummarySelect } from '@/app/lib/definitions';

export const getReview = cache(
  async ({
    userId,
    courseId,
  }: {
    userId: string;
    courseId: string;
  }): Promise<ReviewSummary | null> => {
    try {
      const review = await prisma.review.findUnique({
        where: { userId_courseId: { userId, courseId } },
        select: reviewSummarySelect,
      });
      return review;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);
