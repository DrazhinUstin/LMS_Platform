'use server';

import { prisma } from '@/app/lib/prisma';
import { Prisma } from '@/generated/prisma';
import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import z from 'zod';
import { ChapterSchema } from '@/app/lib/schemas';

export async function createChapter(courseId: string, data: z.infer<typeof ChapterSchema>) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error('Unauthorized!');
    }

    const validation = ChapterSchema.safeParse(data);

    if (!validation.success) {
      throw new Error('Invalid data!');
    }

    const { title } = validation.data;

    const courseLastChapter = await prisma.chapter.findFirst({
      where: { courseId },
      orderBy: { position: 'desc' },
      select: { position: true },
    });

    const createdChapter = await prisma.chapter.create({
      data: { courseId, title, position: (courseLastChapter?.position ?? 0) + 1 },
    });

    revalidatePath(`/dashboard/courses/${courseId}/edit/structure`);

    return createdChapter;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function editChapter(chapterId: string, data: z.infer<typeof ChapterSchema>) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error('Unauthorized!');
    }

    const validation = ChapterSchema.safeParse(data);

    if (!validation.success) {
      throw new Error('Invalid data!');
    }

    const updatedChapter = await prisma.chapter.update({
      where: { id: chapterId },
      data: validation.data,
    });

    revalidatePath(`/dashboard/courses/${updatedChapter.courseId}/edit/structure`);

    return updatedChapter;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteChapter(chapterId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error('Unauthorized!');
    }

    const deletedChapter = await prisma.chapter.delete({
      where: { id: chapterId },
    });

    revalidatePath(`/dashboard/courses/${deletedChapter.courseId}/edit/structure`);

    return deletedChapter;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

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
