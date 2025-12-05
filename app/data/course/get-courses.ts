import 'server-only';
import { prisma } from '@/app/lib/prisma';
import type { Course, CourseLevel, Prisma } from '@/generated/prisma';

export interface CourseFilters {
  query?: string;
  categoryName?: string;
  level?: CourseLevel;
  minPrice?: string;
  maxPrice?: string;
  authorId?: string;
  notEnrolledByUserId?: string;
}

export type CourseSortingOrder = { [key in keyof Course]?: Prisma.SortOrder };

export const courseSortingOrderData: {
  id: number;
  name: string;
  value: CourseSortingOrder;
}[] = [
  { id: 1, name: 'Newest first', value: { createdAt: 'desc' } },
  { id: 2, name: 'Oldest first', value: { createdAt: 'asc' } },
  { id: 3, name: 'Most expensive first', value: { price: 'desc' } },
  { id: 4, name: 'Less expensive first', value: { price: 'asc' } },
];

export const coursesPerPage = 8;

export async function getCourses({
  filters = {},
  orderBy = courseSortingOrderData[0].value,
  page = 1,
}: {
  filters?: CourseFilters;
  orderBy?: CourseSortingOrder;
  page?: number;
}) {
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
    });

    return courses;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
