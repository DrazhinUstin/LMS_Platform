import 'server-only';
import { prisma } from '@/app/lib/prisma';

export async function getCustomersCount({ courseAuthorId }: { courseAuthorId: string }) {
  const count = await prisma.user.count({
    where: { enrollments: { some: { course: { authorId: courseAuthorId }, status: 'ACTIVE' } } },
  });
  return count;
}
