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
