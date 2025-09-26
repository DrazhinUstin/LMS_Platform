'use server';

import { prisma } from '@/app/lib/prisma';
import { Prisma } from '@/generated/prisma';
import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

type ChapterPosition = Prisma.ChapterGetPayload<{ select: { id: true; position: true } }>;

export async function reorderChapters(courseId: string, data: ChapterPosition[]) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error('Unauthorized!');
    }

    const reorderedChapters = await prisma.$transaction(
      data.map(({ id, position }) => prisma.chapter.update({ where: { id }, data: { position } }))
    );

    revalidatePath(`/dashboard/courses/${courseId}/edit/structure`);

    return reorderedChapters;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

type LessonPosition = Prisma.LessonGetPayload<{ select: { id: true; position: true } }>;

export async function reorderLessons(courseId: string, data: LessonPosition[]) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error('Unauthorized!');
    }

    const reorderedLessons = await prisma.$transaction(
      data.map(({ id, position }) => prisma.lesson.update({ where: { id }, data: { position } }))
    );

    revalidatePath(`/dashboard/courses/${courseId}/edit/structure`);

    return reorderedLessons;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
