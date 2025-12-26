import 'server-only';
import { prisma } from '@/app/lib/prisma';
import { Prisma } from '@/generated/prisma';
import { getCustomerSelect, type Customer, type UserSortingOrder } from '@/app/lib/definitions';

export async function getCustomers({
  courseAuthorId,
  order = 'NAME_ASC',
  page = 1,
  customersPerPage = 8,
}: {
  courseAuthorId: string;
  order?: keyof typeof UserSortingOrder;
  page?: number;
  customersPerPage?: number;
}): Promise<Customer[]> {
  let orderBy: Prisma.UserOrderByWithRelationInput;

  switch (order) {
    case 'NAME_ASC':
      orderBy = { name: 'asc' };
      break;
    case 'NAME_DESC':
      orderBy = { name: 'desc' };
      break;
    default:
      orderBy = { name: 'asc' };
      break;
  }

  const customers = await prisma.user.findMany({
    where: { enrollments: { some: { course: { authorId: courseAuthorId }, status: 'ACTIVE' } } },
    orderBy,
    skip: (page - 1) * customersPerPage,
    take: customersPerPage,
    select: getCustomerSelect(courseAuthorId),
  });

  return customers;
}
