import 'server-only';
import { prisma } from '@/app/lib/prisma';
import type { Prisma } from '@/generated/prisma';
import type { CommentFilters } from '@/app/lib/definitions';

export async function getCommentsCount({ filters = {} }: { filters?: CommentFilters }) {
  try {
    const { articleId, userId } = filters;

    const where: Prisma.CommentWhereInput = {
      ...(articleId && { articleId }),
      ...(userId && { userId }),
    };

    const count = await prisma.comment.count({ where });

    return count;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
