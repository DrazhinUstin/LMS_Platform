import 'server-only';
import { prisma } from '@/app/lib/prisma';
import type { Prisma } from '@/generated/prisma';
import {
  type ArticleFilters,
  ArticleSortingOrder,
  type ArticleSummary,
  articleSummarySelect,
} from '@/app/lib/definitions';

export async function getArticles({
  filters = {},
  order = 'CREATED_DESC',
  page = 1,
  articlesPerPage = 8,
}: {
  filters?: ArticleFilters;
  order?: keyof typeof ArticleSortingOrder;
  page?: number;
  articlesPerPage?: number;
}): Promise<ArticleSummary[]> {
  try {
    const { query, categoryName, minReadingTime, maxReadingTime, status, authorId } = filters;

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
      ...((minReadingTime || maxReadingTime) && {
        readingTime: {
          ...(minReadingTime && { gte: +minReadingTime }),
          ...(maxReadingTime && { lte: +maxReadingTime }),
        },
      }),
      ...(status && { status }),
      ...(authorId && { authorId }),
    };

    let orderBy: Prisma.ArticleOrderByWithRelationInput;

    switch (order) {
      case 'CREATED_DESC':
        orderBy = { createdAt: 'desc' };
        break;
      case 'CREATED_ASC':
        orderBy = { createdAt: 'asc' };
        break;
      case 'LIKES_DESC':
        orderBy = { likes: { _count: 'desc' } };
        break;
      case 'LIKES_ASC':
        orderBy = { likes: { _count: 'asc' } };
        break;
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    const articles = await prisma.article.findMany({
      where,
      orderBy,
      skip: (page - 1) * articlesPerPage,
      take: articlesPerPage,
      select: articleSummarySelect,
    });

    return articles;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
