'use server';

import { prisma } from '@/app/lib/prisma';
import { revalidatePath } from 'next/cache';
import z from 'zod';
import { LessonSchema } from '@/app/lib/schemas';
import { getSession } from '@/app/lib/auth.get-session';

export async function editLesson(lessonId: string, data: z.infer<typeof LessonSchema>) {
  try {
    const session = await getSession();

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
