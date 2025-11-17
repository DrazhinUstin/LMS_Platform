import 'server-only';
import { prisma } from '@/app/lib/prisma';
import type { EnrollmentFilters } from './get-enrollments';

export async function getEnrollmentsCount({ filters }: { filters: EnrollmentFilters }) {
  try {
    const { userId } = filters;

    const count = await prisma.enrollment.count({ where: { userId, status: 'ACTIVE' } });

    return count;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
