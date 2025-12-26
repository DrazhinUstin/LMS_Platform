import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import PaginationBar from '@/app/components/pagination-bar';
import SortOrder from '@/app/components/sort-order';
import type { Metadata } from 'next';
import { getSession } from '@/app/lib/auth.get-session';
import EnrollmentsList, { EnrollmentsListSkeleton } from './enrollments-list';
import { EnrollmentSortingOrder } from '@/app/lib/definitions';
import { getEnrollments } from '@/app/data/enrollment/get-enrollments';
import { getEnrollmentsCount } from '@/app/data/enrollment/get-enrollments-count';

export const metadata: Metadata = {
  title: 'Enrollments',
};

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page(props: Props) {
  const searchParams = await props.searchParams;

  const { order, page, ...filters } = searchParams;

  const currentPage = Number(page) || 1;

  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <main className="space-y-8">
      <h2 className="text-center text-2xl font-bold">Enrollments</h2>
      <div className="space-y-8">
        <div className="flex justify-end">
          <SortOrder options={Object.entries(EnrollmentSortingOrder)} />
        </div>
        <Suspense
          key={JSON.stringify(searchParams)}
          fallback={<EnrollmentsListSkeleton length={enrollmentsPerPage} />}
        >
          <Enrollments
            filters={{ ...filters, courseAuthorId: session.user.id }}
            order={order as keyof typeof EnrollmentSortingOrder}
            page={currentPage}
          />
        </Suspense>
      </div>
    </main>
  );
}

async function Enrollments({ filters, order, page }: Parameters<typeof getEnrollments>[0]) {
  const [enrollments, count] = await Promise.all([
    getEnrollments({ filters, order, page, enrollmentsPerPage }),
    getEnrollmentsCount({ filters }),
  ]);

  const totalPages = Math.ceil(count / enrollmentsPerPage);

  return (
    <div>
      <EnrollmentsList enrollments={enrollments} />
      {enrollments.length === 0 && (
        <p className="text-center">Unfortunately, you have not any enrollments yet 😞</p>
      )}
      <PaginationBar currentPage={page as number} totalPages={totalPages} className="mt-8" />
    </div>
  );
}

const enrollmentsPerPage = 8;
