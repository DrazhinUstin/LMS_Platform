import 'server-only';
import { ReviewFilters } from '@/app/data/review/get-reviews';
import { prisma } from '@/app/lib/prisma';

export async function getReviewsCount({ filters = {} }: { filters?: ReviewFilters }) {
  try {
    const { userId, courseId } = filters;

    const count = await prisma.review.count({
      where: {
        ...(userId && { userId }),
        ...(courseId && { courseId }),
      },
    });

    return count;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
