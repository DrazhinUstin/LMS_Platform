'use server';

import { getSession } from '@/app/lib/auth.get-session';
import { prisma } from '@/app/lib/prisma';
import { CommentSchema } from '@/app/lib/schemas';
import { revalidatePath } from 'next/cache';
import z from 'zod';

export async function createComment(articleId: string, data: z.infer<typeof CommentSchema>) {
  try {
    const session = await getSession();

    if (!session) {
      throw new Error('Unauthorized!');
    }

    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: { id: true },
    });

    if (!article) {
      throw new Error('Article does not exist!');
    }

    const validation = CommentSchema.safeParse(data);

    if (!validation.success) {
      throw new Error('Invalid data!');
    }

    const createdComment = await prisma.comment.create({
      data: { articleId: article.id, userId: session.user.id, ...validation.data },
    });

    revalidatePath('/articles');

    return createdComment;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function editComment(id: string, data: z.infer<typeof CommentSchema>) {
  try {
    const session = await getSession();

    if (!session) {
      throw new Error('Unauthorized!');
    }

    const comment = await prisma.comment.findUnique({ where: { id, userId: session.user.id } });

    if (!comment) {
      throw new Error('Comment not found or you are not authorized to edit it!');
    }

    const validation = CommentSchema.safeParse(data);

    if (!validation.success) {
      throw new Error('Invalid data!');
    }

    const editedComment = await prisma.comment.update({ where: { id }, data });

    revalidatePath('/articles');

    return editedComment;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteComment(id: string) {
  try {
    const session = await getSession();

    if (!session) {
      throw new Error('Unauthorized!');
    }

    const comment = await prisma.comment.findUnique({ where: { id, userId: session.user.id } });

    if (!comment) {
      throw new Error('Comment not found or you are not authorized to delete it!');
    }

    const deletedComment = await prisma.comment.delete({ where: { id } });

    revalidatePath('/articles');

    return deletedComment;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
