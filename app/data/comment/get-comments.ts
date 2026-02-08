import 'server-only';
import { prisma } from '@/app/lib/prisma';
import type { Prisma } from '@/generated/prisma';
import {
  type CommentFilters,
  CommentSortingOrder,
  type CommentSummary,
  commentSummarySelect,
} from '@/app/lib/definitions';

export async function getComments({
  filters = {},
  order = 'CREATED_ASC',
  page = 1,
  commentsPerPage = 12,
}: {
  filters?: CommentFilters;
  order?: keyof typeof CommentSortingOrder;
  page?: number;
  commentsPerPage?: number;
}): Promise<CommentSummary[]> {
  try {
    const { articleId, userId } = filters;

    const where: Prisma.CommentWhereInput = {
      ...(articleId && { articleId }),
      ...(userId && { userId }),
    };

    let orderBy: Prisma.CommentOrderByWithRelationInput;

    switch (order) {
      case 'CREATED_DESC':
        orderBy = { createdAt: 'desc' };
        break;
      case 'CREATED_ASC':
        orderBy = { createdAt: 'asc' };
        break;
      default:
        orderBy = { createdAt: 'asc' };
        break;
    }

    const comments = await prisma.comment.findMany({
      where,
      orderBy,
      skip: (page - 1) * commentsPerPage,
      take: commentsPerPage,
      select: commentSummarySelect,
    });

    return comments;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
