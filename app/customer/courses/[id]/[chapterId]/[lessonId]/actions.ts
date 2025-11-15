'use server';

import { auth } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

export async function toggleLessonCompletion(lessonId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error('Unauthorized!');
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: {
        id: true,
        userProgresses: { where: { userId: session.user.id }, select: { isCompleted: true } },
        chapter: {
          select: {
            id: true,
            courseId: true,
            course: {
              select: {
                enrollments: { where: { userId: session.user.id }, select: { status: true } },
              },
            },
          },
        },
      },
    });

    if (!lesson) {
      throw new Error('Lesson does not exist!');
    }

    const isUserEnrolled = lesson.chapter.course.enrollments[0]?.status === 'ACTIVE';

    if (!isUserEnrolled) {
      throw new Error('User does not enrolled in the course!');
    }

    const isLessonCompleted = lesson.userProgresses[0]?.isCompleted;

    await prisma.lessonProgress.upsert({
      where: { lessonId_userId: { lessonId, userId: session.user.id } },
      update: { isCompleted: !isLessonCompleted },
      create: { lessonId, userId: session.user.id, isCompleted: true },
    });

    revalidatePath(`/customer/courses/${lesson.chapter.courseId}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
