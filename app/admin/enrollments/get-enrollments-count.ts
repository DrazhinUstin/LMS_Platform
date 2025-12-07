import { prisma } from '@/app/lib/prisma';
import type { EnrollmentFilters } from './get-enrollments';

export async function getEnrollmentsCount({ filters }: { filters: EnrollmentFilters }) {
  const { courseAuthorId } = filters;

  const count = await prisma.enrollment.count({
    where: { status: 'ACTIVE', ...(courseAuthorId && { course: { authorId: courseAuthorId } }) },
  });

  return count;
}
