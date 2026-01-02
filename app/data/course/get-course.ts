import 'server-only';
import { prisma } from '@/app/lib/prisma';
import { cache } from 'react';
import { CourseDetail, courseDetailSelect } from '@/app/lib/definitions';

export const getCourse = cache(
  async (id: string, authorId?: string): Promise<CourseDetail | null> => {
    try {
      const course = await prisma.course.findUnique({
        where: { id, ...(authorId && { authorId }) },
        select: courseDetailSelect,
      });
      return course;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);
