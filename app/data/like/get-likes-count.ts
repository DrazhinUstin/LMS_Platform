import 'server-only';
import { prisma } from '@/app/lib/prisma';
import type { Prisma } from '@/generated/prisma';
import type { LikeFilters } from '@/app/lib/definitions';

export async function getLikesCount({ filters = {} }: { filters?: LikeFilters }) {
  try {
    const { articleId, userId } = filters;

    const where: Prisma.LikeWhereInput = {
      ...(articleId && { articleId }),
      ...(userId && { userId }),
    };

    const count = await prisma.like.count({ where });

    return count;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
