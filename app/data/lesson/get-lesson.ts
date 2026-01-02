import 'server-only';
import { prisma } from '@/app/lib/prisma';
import { cache } from 'react';
import { type LessonDetail, lessonDetailSelect } from '@/app/lib/definitions';

export const getLesson = cache(
  async (id: string, authorId?: string): Promise<LessonDetail | null> => {
    try {
      const course = await prisma.lesson.findUnique({
        where: { id, ...(authorId && { chapter: { course: { authorId } } }) },
        select: lessonDetailSelect,
      });
      return course;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);
