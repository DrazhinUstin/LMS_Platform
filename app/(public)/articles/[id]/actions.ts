'use server';

import { getSession } from '@/app/lib/auth.get-session';
import { prisma } from '@/app/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function toggleLike(articleId: string) {
  try {
    const session = await getSession();

    if (!session) {
      throw new Error('Unauthorized!');
    }

    const article = await prisma.article.findUnique({
      where: { id: articleId, status: 'PUBLISHED' },
      select: { likes: { where: { userId: session.user.id } } },
    });

    if (!article) {
      throw new Error('Article not found!');
    }

    if (article.likes[0]) {
      const deletedLike = await prisma.like.delete({
        where: { userId_articleId: { userId: session.user.id, articleId } },
      });

      revalidatePath('/articles');

      return deletedLike;
    }

    const createdLike = await prisma.like.create({ data: { userId: session.user.id, articleId } });

    revalidatePath('/articles');

    return createdLike;
  } catch (error) {
    console.error(error);

    throw error;
  }
}
