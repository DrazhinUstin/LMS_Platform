import 'server-only';
import { prisma } from '@/app/lib/prisma';
import type { Prisma } from '@/generated/prisma';
import {
  type CourseFilters,
  CourseSortingOrder,
  type CourseSummary,
  courseSummarySelect,
} from '@/app/lib/definitions';

export async function getCourses({
  filters = {},
  order = 'CREATED_DESC',
  page = 1,
  coursesPerPage = 8,
}: {
  filters?: CourseFilters;
  order?: keyof typeof CourseSortingOrder;
  page?: number;
  coursesPerPage?: number;
}): Promise<CourseSummary[]> {
  try {
    const { query, categoryName, level, minPrice, maxPrice, authorId, notEnrolledByUserId } =
      filters;

    let queryWhereInput: Prisma.CourseWhereInput = {};

    if (query) {
      queryWhereInput = {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { briefDescription: { contains: query, mode: 'insensitive' } },
        ],
      };
    }

    const where: Prisma.CourseWhereInput = {
      ...queryWhereInput,
      ...(categoryName && { categoryName }),
      ...(level && { level }),
      ...((minPrice || maxPrice) && {
        price: {
          ...(minPrice && { gte: Math.round(+minPrice * 100) }),
          ...(maxPrice && { lte: Math.round(+maxPrice * 100) }),
        },
      }),
      ...(authorId && { authorId }),
      ...(notEnrolledByUserId && {
        enrollments: { none: { userId: notEnrolledByUserId, status: 'ACTIVE' } },
      }),
    };

    let orderBy: Prisma.CourseOrderByWithRelationInput;

    switch (order) {
      case 'CREATED_DESC':
        orderBy = { createdAt: 'desc' };
        break;
      case 'CREATED_ASC':
        orderBy = { createdAt: 'asc' };
        break;
      case 'POPULARITY_DESC':
        orderBy = { enrollments: { _count: 'desc' } };
        break;
      case 'POPULARITY_ASC':
        orderBy = { enrollments: { _count: 'asc' } };
        break;
      case 'PRICE_DESC':
        orderBy = { price: 'desc' };
        break;
      case 'PRICE_ASC':
        orderBy = { price: 'asc' };
        break;
      case 'RATING_DESC':
        orderBy = { avgRating: { sort: 'desc', nulls: 'last' } };
        break;
      case 'RATING_ASC':
        orderBy = { avgRating: { sort: 'asc', nulls: 'first' } };
        break;
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    const courses = await prisma.course.findMany({
      where,
      orderBy,
      skip: (page - 1) * coursesPerPage,
      take: coursesPerPage,
      select: courseSummarySelect,
    });

    return courses;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
