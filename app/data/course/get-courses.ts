import 'server-only';
import { prisma } from '@/app/lib/prisma';
import type { Prisma } from '@/generated/prisma';
import {
  type CourseFilters,
  type CourseSortingOrder,
  type CourseSummary,
  courseSummarySelect,
} from '@/app/lib/definitions';
import { courseSortingOrderData } from '@/app/lib/sorting-order-data';

export const coursesPerPage = 8;

export async function getCourses({
  filters = {},
  orderBy = courseSortingOrderData[0].value,
  page = 1,
}: {
  filters?: CourseFilters;
  orderBy?: CourseSortingOrder;
  page?: number;
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
