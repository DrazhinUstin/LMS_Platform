import { prisma } from '@/app/lib/prisma';
import { cache } from 'react';

export const getLesson = cache(async (id: string) => {
  try {
    const lesson = await prisma.lesson.findUnique({ where: { id } });
    return lesson;
  } catch (error) {
    console.error(error);
    throw error;
  }
});
