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
    const { query, categoryName, level, minPrice, maxPrice, authorId } = filters;

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
      ...(minPrice && { price: { gte: +minPrice * 100 } }),
      ...(maxPrice && { price: { lte: +maxPrice * 100 } }),
      ...(authorId && { authorId }),
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
