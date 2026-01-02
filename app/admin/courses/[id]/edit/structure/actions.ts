'use server';

import { prisma } from '@/app/lib/prisma';
import { Prisma } from '@/generated/prisma';
import { revalidatePath } from 'next/cache';
import z from 'zod';
import { ChapterSchema, LessonSchema } from '@/app/lib/schemas';
import { getSession } from '@/app/lib/auth.get-session';

export async function createChapter(courseId: string, data: z.infer<typeof ChapterSchema>) {
  try {
    const session = await getSession();

    if (!session || session.user.role !== 'admin') {
      throw new Error('Unauthorized!');
    }

    const validation = ChapterSchema.safeParse(data);

    if (!validation.success) {
      throw new Error('Invalid data!');
    }

    const { title } = validation.data;

    const courseWithLastChapter = await prisma.course.findUnique({
      where: { id: courseId, authorId: session.user.id },
      select: { chapters: { orderBy: { position: 'desc' }, take: 1, select: { position: true } } },
    });

    if (!courseWithLastChapter) {
      throw new Error('Course not found or you are not authorized to update it!');
    }

    const lastChapter = courseWithLastChapter.chapters[0];

    const createdChapter = await prisma.chapter.create({
      data: { courseId, title, position: (lastChapter?.position ?? 0) + 1 },
    });

    revalidatePath(`/admin/courses/${courseId}/edit/structure`);

    return createdChapter;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function editChapter(chapterId: string, data: z.infer<typeof ChapterSchema>) {
  try {
    const session = await getSession();

    if (!session || session.user.role !== 'admin') {
      throw new Error('Unauthorized!');
    }

    const validation = ChapterSchema.safeParse(data);

    if (!validation.success) {
      throw new Error('Invalid data!');
    }

    const updatedChapter = await prisma.chapter.update({
      where: { id: chapterId, course: { authorId: session.user.id } },
      data: validation.data,
    });

    revalidatePath(`/admin/courses/${updatedChapter.courseId}/edit/structure`);

    return updatedChapter;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      throw new Error('Chapter not found or you are not authorized to update it.');
    }

    console.error(error);
    throw error;
  }
}

export async function deleteChapter({
  courseId,
  chapterId,
}: {
  courseId: string;
  chapterId: string;
}) {
  try {
    const session = await getSession();

    if (!session || session.user.role !== 'admin') {
      throw new Error('Unauthorized!');
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId, authorId: session.user.id, chapters: { some: { id: chapterId } } },
      select: { chapters: { select: { id: true }, orderBy: { position: 'asc' } } },
    });

    if (!course) {
      throw new Error('Course not found or you are not authorized to update it!');
    }

    const chaptersToReorder = course.chapters
      .filter(({ id }) => id !== chapterId)
      .map(({ id }, index) =>
        prisma.chapter.update({ where: { id }, data: { position: index + 1 } })
      );

    const [deletedChapter] = await prisma.$transaction([
      prisma.chapter.delete({
        where: { id: chapterId },
      }),
      ...chaptersToReorder,
    ]);

    revalidatePath(`/admin/courses/${courseId}/edit/structure`);

    return deletedChapter;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function createLesson(chapterId: string, data: z.infer<typeof LessonSchema>) {
  try {
    const session = await getSession();

    if (!session || session.user.role !== 'admin') {
      throw new Error('Unauthorized!');
    }

    const validation = LessonSchema.safeParse(data);

    if (!validation.success) {
      throw new Error('Invalid data!');
    }

    const chapterWithLastLesson = await prisma.chapter.findUnique({
      where: { id: chapterId, course: { authorId: session.user.id } },
      select: { lessons: { orderBy: { position: 'desc' }, take: 1, select: { position: true } } },
    });

    if (!chapterWithLastLesson) {
      throw new Error('Chapter not found or you are not authorized to update it!');
    }

    const lastLesson = chapterWithLastLesson.lessons[0];

    const { chapter, ...createdLesson } = await prisma.lesson.create({
      data: { chapterId, ...validation.data, position: (lastLesson?.position ?? 0) + 1 },
      include: { chapter: { select: { courseId: true } } },
    });

    revalidatePath(`/admin/courses/${chapter.courseId}/edit/structure`);

    return createdLesson;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteLesson({
  chapterId,
  lessonId,
}: {
  chapterId: string;
  lessonId: string;
}) {
  try {
    const session = await getSession();

    if (!session || session.user.role !== 'admin') {
      throw new Error('Unauthorized!');
    }

    const chapter = await prisma.chapter.findUnique({
      where: {
        id: chapterId,
        course: { authorId: session.user.id },
        lessons: { some: { id: lessonId } },
      },
      select: { courseId: true, lessons: { select: { id: true }, orderBy: { position: 'asc' } } },
    });

    if (!chapter) {
      throw new Error('Chapter not found or you are not authorized to update it!');
    }

    const lessonsToReorder = chapter.lessons
      .filter(({ id }) => id !== lessonId)
      .map(({ id }, index) =>
        prisma.lesson.update({ where: { id }, data: { position: index + 1 } })
      );

    const [deletedLesson] = await prisma.$transaction([
      prisma.lesson.delete({
        where: { id: lessonId },
      }),
      ...lessonsToReorder,
    ]);

    revalidatePath(`/admin/courses/${chapter.courseId}/edit/structure`);

    return deletedLesson;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

type ChapterPosition = Prisma.ChapterGetPayload<{ select: { id: true; position: true } }>;

export async function reorderChapters(courseId: string, data: ChapterPosition[]) {
  try {
    const session = await getSession();

    if (!session || session.user.role !== 'admin') {
      throw new Error('Unauthorized!');
    }

    const reorderedChapters = await prisma.$transaction(
      data.map(({ id, position }) =>
        prisma.chapter.update({
          where: { id, courseId, course: { authorId: session.user.id } },
          data: { position },
        })
      )
    );

    revalidatePath(`/admin/courses/${courseId}/edit/structure`);

    return reorderedChapters;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      throw new Error('Chapter not found or you are not authorized to update it.');
    }

    console.error(error);
    throw error;
  }
}

type LessonPosition = Prisma.LessonGetPayload<{ select: { id: true; position: true } }>;

export async function reorderLessons(courseId: string, data: LessonPosition[]) {
  try {
    const session = await getSession();

    if (!session || session.user.role !== 'admin') {
      throw new Error('Unauthorized!');
    }

    const reorderedLessons = await prisma.$transaction(
      data.map(({ id, position }) =>
        prisma.lesson.update({
          where: { id, chapter: { courseId, course: { authorId: session.user.id } } },
          data: { position },
        })
      )
    );

    revalidatePath(`/admin/courses/${courseId}/edit/structure`);

    return reorderedLessons;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      throw new Error('Lesson not found or you are not authorized to update it.');
    }

    console.error(error);
    throw error;
  }
}
