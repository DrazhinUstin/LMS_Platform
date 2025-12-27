import 'server-only';
import { prisma } from '@/app/lib/prisma';
import {
  type ReviewFilters,
  ReviewSortingOrder,
  type ReviewSummary,
  reviewSummarySelect,
} from '@/app/lib/definitions';
import type { Prisma } from '@/generated/prisma';

export async function getReviews({
  filters = {},
  order = 'CREATED_DESC',
  page = 1,
  reviewsPerPage = 8,
}: {
  filters?: ReviewFilters;
  order?: keyof typeof ReviewSortingOrder;
  page?: number;
  reviewsPerPage?: number;
}): Promise<ReviewSummary[]> {
  try {
    const { userId, courseId, courseAuthorId } = filters;

    let orderBy: Prisma.ReviewOrderByWithRelationInput;

    switch (order) {
      case 'CREATED_DESC':
        orderBy = { createdAt: 'desc' };
        break;
      case 'CREATED_ASC':
        orderBy = { createdAt: 'asc' };
        break;
      case 'RATING_DESC':
        orderBy = { rating: 'desc' };
        break;
      case 'RATING_ASC':
        orderBy = { rating: 'asc' };
        break;
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

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
