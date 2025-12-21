import 'server-only';
import { prisma } from '@/app/lib/prisma';
import { cache } from 'react';
import { getUserCourseDetailSelect, UserCourseDetail } from '@/app/lib/definitions';

export const getUserCourse = cache(
  async ({
    courseId,
    userId,
  }: {
    courseId: string;
    userId: string;
  }): Promise<UserCourseDetail | null> => {
    try {
      const course = await prisma.course.findUnique({
        where: { id: courseId, enrollments: { some: { userId, status: 'ACTIVE' } } },
        select: getUserCourseDetailSelect(userId),
      });
      return course;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);
