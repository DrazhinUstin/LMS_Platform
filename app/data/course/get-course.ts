import 'server-only';
import { prisma } from '@/app/lib/prisma';
import type { Prisma } from '@/generated/prisma';
import { cache } from 'react';

const courseInclude = {
  chapters: {
    select: {
      id: true,
      title: true,
      lessons: { select: { id: true, title: true }, orderBy: { position: 'asc' } },
      _count: { select: { lessons: true } },
    },
    orderBy: { position: 'asc' },
  },
  _count: { select: { chapters: true, reviews: true } },
} satisfies Prisma.CourseInclude;

export type CourseTypeWithInclude = Prisma.CourseGetPayload<{
  include: typeof courseInclude;
}>;

export const getCourse = cache(async (id: string): Promise<CourseTypeWithInclude | null> => {
  try {
    const course = await prisma.course.findUnique({ where: { id }, include: courseInclude });
    return course;
  } catch (error) {
    console.error(error);
    throw error;
  }
});
