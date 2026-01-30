import 'server-only';
import { prisma } from '@/app/lib/prisma';
import type { Prisma } from '@/generated/prisma';
import type { ArticleFilters } from '@/app/lib/definitions';

export async function getArticlesCount({ filters = {} }: { filters?: ArticleFilters }) {
  try {
    const { query, categoryName, status, authorId } = filters;

    let queryWhereInput: Prisma.ArticleWhereInput = {};

    if (query) {
      queryWhereInput = {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { briefDescription: { contains: query, mode: 'insensitive' } },
        ],
      };
    }

    const where: Prisma.ArticleWhereInput = {
      ...queryWhereInput,
      ...(categoryName && { categoryName }),
      ...(status && { status }),
      ...(authorId && { authorId }),
    };

    const count = await prisma.article.count({ where });

    return count;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
