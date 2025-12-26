import 'server-only';
import { prisma } from '@/app/lib/prisma';
import { Prisma } from '@/generated/prisma';
import {
  EnrollmentSortingOrder,
  getUserEnrollmentSummarySelect,
  type UserEnrollmentSummary,
} from '@/app/lib/definitions';

export async function getUserEnrollments({
  userId,
  order = 'CREATED_DESC',
  page = 1,
  enrollmentsPerPage = 8,
}: {
  userId: string;
  order?: keyof typeof EnrollmentSortingOrder;
  page?: number;
  enrollmentsPerPage?: number;
}): Promise<UserEnrollmentSummary[]> {
  try {
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
      where: { userId, status: 'ACTIVE' },
      orderBy,
      skip: (page - 1) * enrollmentsPerPage,
      take: enrollmentsPerPage,
      select: getUserEnrollmentSummarySelect(userId),
    });

    return enrollments;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
