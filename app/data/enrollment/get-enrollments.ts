import 'server-only';
import { prisma } from '@/app/lib/prisma';
import { Prisma } from '@/generated/prisma';
import {
  type EnrollmentFilters,
  type EnrollmentSortingOrder,
  type EnrollmentSummary,
  enrollmentSummarySelect,
} from '@/app/lib/definitions';

export async function getEnrollments({
  filters = {},
  order = 'CREATED_DESC',
  page = 1,
  enrollmentsPerPage = 8,
}: {
  filters?: EnrollmentFilters;
  order?: keyof typeof EnrollmentSortingOrder;
  page?: number;
  enrollmentsPerPage?: number;
}): Promise<EnrollmentSummary[]> {
  try {
    const { courseAuthorId } = filters;

    let orderBy: Prisma.EnrollmentOrderByWithRelationInput;

    switch (order) {
      case 'CREATED_DESC':
        orderBy = { createdAt: 'desc' };
        break;
      case 'CREATED_ASC':
        orderBy = { createdAt: 'asc' };
        break;
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    const enrollments = await prisma.enrollment.findMany({
      where: { status: 'ACTIVE', ...(courseAuthorId && { course: { authorId: courseAuthorId } }) },
      orderBy,
      skip: (page - 1) * enrollmentsPerPage,
      take: enrollmentsPerPage,
      select: enrollmentSummarySelect,
    });

    return enrollments;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
