import 'server-only';
import { prisma } from '@/app/lib/prisma';
import type { Prisma } from '@/generated/prisma';
import { cache } from 'react';

const getUserLessonInclude = (userId: string) => {
  return {
    userProgresses: { where: { userId }, select: { isCompleted: true } },
  } satisfies Prisma.LessonInclude;
};

export type UserLessonTypeWithInclude = Prisma.LessonGetPayload<{
  include: ReturnType<typeof getUserLessonInclude>;
}>;

export const getUserLesson = cache(
  async ({
    lessonId,
    userId,
  }: {
    lessonId: string;
    userId: string;
  }): Promise<UserLessonTypeWithInclude | null> => {
    try {
      const course = await prisma.lesson.findUnique({
        where: {
          id: lessonId,
          chapter: { course: { enrollments: { some: { userId, status: 'ACTIVE' } } } },
        },
        include: getUserLessonInclude(userId),
      });
      return course;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);
