import { redirect } from 'next/navigation';
import {
  enrollmentSortingOrderData,
  enrollmentsPerPage,
  getEnrollments,
} from '@/app/data/enrollment/get-enrollments';
import { Suspense } from 'react';
import { getEnrollmentsCount } from '@/app/data/enrollment/get-enrollments-count';
import PaginationBar from '@/app/components/pagination-bar';
import SortOrder from '@/app/components/sort-order';
import type { Metadata } from 'next';
import { getSession } from '@/app/lib/auth.get-session';
import EnrollmentsList, { EnrollmentsListSkeleton } from './enrollments-list';

export const metadata: Metadata = {
  title: 'Enrollments',
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
      <h2 className="text-center text-2xl font-bold">Enrollments history</h2>
      <div className="space-y-8">
        <div className="flex justify-end">
          <SortOrder options={enrollmentSortingOrderData} />
        </div>
        <Suspense key={JSON.stringify(searchParams)} fallback={<EnrollmentsListSkeleton />}>
          <Enrollments
            filters={{ ...filters, userId: session.user.id }}
            orderBy={parsedOrderBy}
            page={currentPage}
          />
        </Suspense>
      </div>
    </main>
  );
}

async function Enrollments({ filters, orderBy, page }: Parameters<typeof getEnrollments>[0]) {
  const [enrollments, count] = await Promise.all([
    getEnrollments({ filters, orderBy, page }),
    getEnrollmentsCount({ filters }),
  ]);

  const totalPages = Math.ceil(count / enrollmentsPerPage);

  return (
    <div>
      <EnrollmentsList enrollments={enrollments} />
      {enrollments.length === 0 && (
        <p className="text-center">Unfortunately, you have no any enrollments yet 😞</p>
      )}
      <PaginationBar currentPage={page as number} totalPages={totalPages} className="mt-8" />
    </div>
  );
}
