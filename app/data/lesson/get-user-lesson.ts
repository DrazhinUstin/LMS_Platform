import 'server-only';
import { prisma } from '@/app/lib/prisma';
import { cache } from 'react';
import { getUserLessonDetailSelect, type UserLessonDetail } from '@/app/lib/definitions';

export const getUserLesson = cache(
  async ({
    lessonId,
    userId,
    isAuthor = false,
  }: {
    lessonId: string;
    userId: string;
    isAuthor?: boolean;
  }): Promise<UserLessonDetail | null> => {
    try {
      const course = await prisma.lesson.findUnique({
        where: {
          id: lessonId,
          ...(isAuthor
            ? { chapter: { course: { authorId: userId } } }
            : { chapter: { course: { enrollments: { some: { userId, status: 'ACTIVE' } } } } }),
        },
        select: getUserLessonDetailSelect(userId),
      });
      return course;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);
