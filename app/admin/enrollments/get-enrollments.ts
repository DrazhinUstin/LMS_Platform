import 'server-only';
import { prisma } from '@/app/lib/prisma';
import { Enrollment, Prisma } from '@/generated/prisma';

export interface EnrollmentFilters {
  courseAuthorId?: string;
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

const enrollmentSelect = {
  amount: true,
  status: true,
  createdAt: true,
  course: {
    select: {
      id: true,
      title: true,
      previewImageKey: true,
    },
  },
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  },
} satisfies Prisma.EnrollmentSelect;

export type EnrollmentTypeWithSelect = Prisma.EnrollmentGetPayload<{
  select: typeof enrollmentSelect;
}>;

export async function getEnrollments({
  filters = {},
  orderBy = enrollmentSortingOrderData[0].value,
  page = 1,
}: {
  filters?: EnrollmentFilters;
  orderBy?: EnrollmentSortingOrder;
  page?: number;
}): Promise<EnrollmentTypeWithSelect[]> {
  try {
    const { courseAuthorId } = filters;

    const enrollments = await prisma.enrollment.findMany({
      where: { status: 'ACTIVE', ...(courseAuthorId && { course: { authorId: courseAuthorId } }) },
      orderBy,
      skip: (page - 1) * enrollmentsPerPage,
      take: enrollmentsPerPage,
      select: enrollmentSelect,
    });

    return enrollments;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
