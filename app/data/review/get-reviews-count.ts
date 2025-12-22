import 'server-only';
import { ReviewFilters } from '@/app/lib/definitions';
import { prisma } from '@/app/lib/prisma';

export async function getReviewsCount({ filters = {} }: { filters?: ReviewFilters }) {
  try {
    const { userId, courseId, courseAuthorId } = filters;

    const count = await prisma.review.count({
      where: {
        ...(userId && { userId }),
        ...(courseId && { courseId }),
        ...(courseAuthorId && { course: { authorId: courseAuthorId } }),
      },
    });

    return count;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
