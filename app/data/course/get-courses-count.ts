import 'server-only';
import type { Prisma } from '@/generated/prisma';
import { CourseFilters } from './get-courses';
import { prisma } from '@/app/lib/prisma';

export default async function getCoursesCount({ filters = {} }: { filters?: CourseFilters }) {
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
      ...((minPrice || maxPrice) && {
        price: {
          ...(minPrice && { gte: +minPrice * 100 }),
          ...(maxPrice && { lte: +maxPrice * 100 }),
        },
      }),
      ...(authorId && { authorId }),
    };

    const count = await prisma.course.count({ where });

    return count;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
