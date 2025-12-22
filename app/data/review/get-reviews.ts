import 'server-only';
import { prisma } from '@/app/lib/prisma';
import { reviewSortingOrderData } from '@/app/lib/sorting-order-data';
import {
  type ReviewFilters,
  type ReviewSortingOrder,
  type ReviewSummary,
  reviewSummarySelect,
} from '@/app/lib/definitions';

export const reviewsPerPage = 8;

export async function getReviews({
  filters = {},
  orderBy = reviewSortingOrderData[0].value,
  page = 1,
}: {
  filters?: ReviewFilters;
  orderBy?: ReviewSortingOrder;
  page?: number;
}): Promise<ReviewSummary[]> {
  try {
    const { userId, courseId, courseAuthorId } = filters;

    const reviews = await prisma.review.findMany({
      where: {
        ...(userId && { userId }),
        ...(courseId && { courseId }),
        ...(courseAuthorId && { course: { authorId: courseAuthorId } }),
      },
      orderBy,
      skip: (page - 1) * reviewsPerPage,
      take: reviewsPerPage,
      select: reviewSummarySelect,
    });

    return reviews;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
