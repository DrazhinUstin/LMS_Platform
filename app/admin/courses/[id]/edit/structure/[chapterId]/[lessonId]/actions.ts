'use server';

import { prisma } from '@/app/lib/prisma';
import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import z from 'zod';
import { LessonSchema } from '@/app/lib/schemas';

export async function editLesson(lessonId: string, data: z.infer<typeof LessonSchema>) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== 'admin') {
      throw new Error('Unauthorized!');
    }

    const validation = LessonSchema.safeParse(data);

    if (!validation.success) {
      throw new Error('Invalid data!');
    }

    const { chapter, ...updatedLesson } = await prisma.lesson.update({
      where: { id: lessonId },
      data: validation.data,
      include: { chapter: { select: { courseId: true } } },
    });

    revalidatePath(`/admin/courses/${chapter.courseId}/edit/structure`);

    return updatedLesson;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
