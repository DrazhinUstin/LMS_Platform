import { prisma } from '@/app/lib/prisma';
import { cache } from 'react';

export const getEnrollment = cache(
  async ({ userId, courseId }: { userId: string; courseId: string }) => {
    try {
      const enrollment = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId, courseId }, status: 'ACTIVE' },
      });
      return enrollment;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);
