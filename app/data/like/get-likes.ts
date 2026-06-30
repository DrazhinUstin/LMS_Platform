import 'server-only';
import { prisma } from '@/app/lib/prisma';
import type { Prisma } from '@/generated/prisma';
import {
  type LikeFilters,
  LikeSortingOrder,
  type LikeSummary,
  likeSummarySelect,
} from '@/app/lib/definitions';

export async function getLikes({
  filters = {},
  order = 'CREATED_DESC',
  page = 1,
  likesPerPage = 12,
}: {
  filters?: LikeFilters;
  order?: keyof typeof LikeSortingOrder;
  page?: number;
  likesPerPage?: number;
}): Promise<LikeSummary[]> {
  try {
    const { articleId, userId } = filters;

    const where: Prisma.LikeWhereInput = {
      ...(articleId && { articleId }),
      ...(userId && { userId }),
    };

    let orderBy: Prisma.LikeOrderByWithRelationInput;

    switch (order) {
      case 'CREATED_DESC':
        orderBy = { likedAt: 'desc' };
        break;
      case 'CREATED_ASC':
        orderBy = { likedAt: 'asc' };
        break;
      default:
        orderBy = { likedAt: 'desc' };
        break;
    }

    const likes = await prisma.like.findMany({
      where,
      orderBy,
      skip: (page - 1) * likesPerPage,
      take: likesPerPage,
      select: likeSummarySelect,
    });

    return likes;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
