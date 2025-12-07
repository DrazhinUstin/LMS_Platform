import 'server-only';
import { prisma } from '@/app/lib/prisma';
import { CustomerFilters } from './get-customers';

export async function getCustomersCount({ filters }: { filters: CustomerFilters }) {
  const { authorId } = filters;

  const count = await prisma.user.count({
    where: { enrollments: { some: { course: { authorId }, status: 'ACTIVE' } } },
  });

  return count;
}
