import 'server-only';
import { prisma } from '@/app/lib/prisma';
import { Prisma, User } from '@/generated/prisma';

export interface CustomerFilters {
  authorId: string;
}

type CustomerSortingOrder = { [key in keyof User]?: Prisma.SortOrder };

export const customerSortingOrderData: {
  id: number;
  name: string;
  value: CustomerSortingOrder;
}[] = [
  { id: 1, name: 'By name (a to z)', value: { name: 'desc' } },
  { id: 2, name: 'By name (z to a)', value: { name: 'asc' } },
];

export const customersPerPage = 8;

const getCustomersSelect = (authorId: string) =>
  ({
    id: true,
    name: true,
    email: true,
    image: true,
    enrollments: {
      where: { course: { authorId }, status: 'ACTIVE' },
      select: { amount: true, course: { select: { id: true, title: true } } },
    },
  }) satisfies Prisma.UserSelect;

export type CustomerTypeWithSelect = Prisma.UserGetPayload<{
  select: ReturnType<typeof getCustomersSelect>;
}>;

export async function getCustomers({
  filters,
  orderBy = customerSortingOrderData[0].value,
  page = 1,
}: {
  filters: CustomerFilters;
  orderBy?: CustomerSortingOrder;
  page?: number;
}): Promise<CustomerTypeWithSelect[]> {
  const { authorId } = filters;

  const customers = await prisma.user.findMany({
    where: { enrollments: { some: { course: { authorId }, status: 'ACTIVE' } } },
    orderBy,
    skip: (page - 1) * customersPerPage,
    take: customersPerPage,
    select: getCustomersSelect(authorId),
  });

  return customers;
}
