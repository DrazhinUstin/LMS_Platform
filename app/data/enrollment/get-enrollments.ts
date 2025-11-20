import 'server-only';
import { prisma } from '@/app/lib/prisma';
import { Enrollment, Prisma } from '@/generated/prisma';

export interface EnrollmentFilters {
  userId: string;
}

type EnrollmentSortingOrder = { [key in keyof Enrollment]?: Prisma.SortOrder };

export const enrollmentSortingOrderData: {
  id: number;
  name: string;
  value: EnrollmentSortingOrder;
}[] = [
  { id: 1, name: 'Newest first', value: { createdAt: 'desc' } },
  { id: 2, name: 'Oldest first', value: { createdAt: 'asc' } },
];

export const enrollmentsPerPage = 8;

const getEnrollmentSelect = (userId: string) => {
  return {
    amount: true,
    status: true,
    course: {
      select: {
        id: true,
        title: true,
        previewImageKey: true,
        briefDescription: true,
        categoryName: true,
        duration: true,
        level: true,
        chapters: {
          select: {
            id: true,
            lessons: {
              select: {
                id: true,
                userProgresses: { where: { userId }, select: { isCompleted: true } },
              },
              orderBy: { position: 'asc' },
            },
            _count: { select: { lessons: true } },
          },
          orderBy: { position: 'asc' },
        },
      },
    },
  } satisfies Prisma.EnrollmentSelect;
};

export type EnrollmentTypeWithSelect = Prisma.EnrollmentGetPayload<{
  select: ReturnType<typeof getEnrollmentSelect>;
}>;

export async function getEnrollments({
  filters,
  orderBy = enrollmentSortingOrderData[0].value,
  page = 1,
}: {
  filters: EnrollmentFilters;
  orderBy?: EnrollmentSortingOrder;
  page?: number;
}): Promise<EnrollmentTypeWithSelect[]> {
  try {
    const { userId } = filters;

    const enrollments = await prisma.enrollment.findMany({
      where: { userId, status: 'ACTIVE' },
      orderBy,
      skip: (page - 1) * enrollmentsPerPage,
      take: enrollmentsPerPage,
      select: getEnrollmentSelect(userId),
    });

    return enrollments;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
