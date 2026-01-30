import 'server-only';
import { prisma } from '@/app/lib/prisma';
import { cache } from 'react';
import { ArticleDetail, articleDetailSelect } from '@/app/lib/definitions';

export const getArticle = cache(
  async ({ id, authorId }: { id: string; authorId?: string }): Promise<ArticleDetail | null> => {
    try {
      const article = await prisma.article.findUnique({
        where: { id, ...(authorId ? { authorId } : { status: 'PUBLISHED' }) },
        select: articleDetailSelect,
      });
      return article;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);
