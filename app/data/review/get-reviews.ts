import 'server-only';
import { prisma } from '@/app/lib/prisma';
import type { Prisma, Review } from '@/generated/prisma';

export interface ReviewFilters {
  userId?: string;
  courseId?: string;
}

export type ReviewSortingOrder = { [key in keyof Review]?: Prisma.SortOrder };

export const reviewSortingOrderData: {
  id: number;
  name: string;
  value: ReviewSortingOrder;
}[] = [
  { id: 1, name: 'Newest first', value: { createdAt: 'desc' } },
  { id: 2, name: 'Oldest first', value: { createdAt: 'asc' } },
];

export const reviewsPerPage = 8;

export const reviewSelect = {
  id: true,
  title: true,
  description: true,
  rating: true,
  createdAt: true,
  user: {
    select: { id: true, name: true, image: true },
  },
  course: { select: { id: true, title: true } },
} satisfies Prisma.ReviewSelect;

export type ReviewTypeWithSelect = Prisma.ReviewGetPayload<{ select: typeof reviewSelect }>;

export async function getReviews({
  filters = {},
  orderBy = reviewSortingOrderData[0].value,
  page = 1,
}: {
  filters?: ReviewFilters;
  orderBy?: ReviewSortingOrder;
  page?: number;
}): Promise<ReviewTypeWithSelect[]> {
  try {
    const { userId, courseId } = filters;

    const reviews = await prisma.review.findMany({
      where: {
        ...(userId && { userId }),
        ...(courseId && { courseId }),
      },
      orderBy,
      skip: (page - 1) * reviewsPerPage,
      take: reviewsPerPage,
      select: reviewSelect,
    });

    return reviews;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
