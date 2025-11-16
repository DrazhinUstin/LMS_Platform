import 'server-only';
import { prisma } from '@/app/lib/prisma';
import type { Prisma } from '@/generated/prisma';
import { cache } from 'react';

const getUserCourseInclude = (userId: string) => {
  return {
    chapters: {
      select: {
        id: true,
        title: true,
        lessons: {
          select: {
            id: true,
            title: true,
            userProgresses: { where: { userId }, select: { isCompleted: true } },
          },
          orderBy: { position: 'asc' },
        },
        _count: { select: { lessons: true } },
      },
      orderBy: { position: 'asc' },
    },
    _count: { select: { chapters: true } },
  } satisfies Prisma.CourseInclude;
};

export type UserCourseTypeWithInclude = Prisma.CourseGetPayload<{
  include: ReturnType<typeof getUserCourseInclude>;
}>;

export const getUserCourse = cache(
  async ({
    courseId,
    userId,
  }: {
    courseId: string;
    userId: string;
  }): Promise<UserCourseTypeWithInclude | null> => {
    try {
      const course = await prisma.course.findUnique({
        where: { id: courseId, enrollments: { some: { userId, status: 'ACTIVE' } } },
        include: getUserCourseInclude(userId),
      });
      return course;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);
