import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import PaginationBar from '@/app/components/pagination-bar';
import SortOrder from '@/app/components/sort-order';
import type { Metadata } from 'next';
import { getSession } from '@/app/lib/auth.get-session';
import { customerSortingOrderData, customersPerPage, getCustomers } from './get-customers';
import CustomersList, { CustomersListSkeleton } from './customers-list';
import { getCustomersCount } from './get-customers-count';

export const metadata: Metadata = {
  title: 'Customers',
};

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page(props: Props) {
  const searchParams = await props.searchParams;

  const { orderBy, page, ...filters } = searchParams;

  const parsedOrderBy = orderBy && !Array.isArray(orderBy) ? JSON.parse(orderBy) : undefined;

  const currentPage = Number(page) || 1;

  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <main className="space-y-8">
      <h2 className="text-center text-2xl font-bold">Customers</h2>
      <div className="space-y-8">
        <div className="flex justify-end">
          <SortOrder options={customerSortingOrderData} />
        </div>
        <Suspense key={JSON.stringify(searchParams)} fallback={<CustomersListSkeleton />}>
          <Customers
            filters={{ ...filters, authorId: session.user.id }}
            orderBy={parsedOrderBy}
            page={currentPage}
          />
        </Suspense>
      </div>
    </main>
  );
}

async function Customers({ filters, orderBy, page }: Parameters<typeof getCustomers>[0]) {
  const [customers, count] = await Promise.all([
    getCustomers({ filters, orderBy, page }),
    getCustomersCount({ filters }),
  ]);

  const totalPages = Math.ceil(count / customersPerPage);

  return (
    <div>
      <CustomersList customers={customers} />
      {customers.length === 0 && (
        <p className="text-center">Unfortunately, you have not any customers yet 😞</p>
      )}
      <PaginationBar currentPage={page as number} totalPages={totalPages} className="mt-8" />
    </div>
  );
}
