import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import PaginationBar from '@/app/components/pagination-bar';
import SortOrder from '@/app/components/sort-order';
import type { Metadata } from 'next';
import { getSession } from '@/app/lib/auth.get-session';
import EnrollmentsList, { EnrollmentsListSkeleton } from './enrollments-list';
import { getUserEnrollments } from '@/app/data/enrollment/get-user-enrollments';
import { getUserEnrollmentsCount } from '@/app/data/enrollment/get-user-enrollments-count';
import { EnrollmentSortingOrder } from '@/app/lib/definitions';

export const metadata: Metadata = {
  title: 'Enrollments',
};

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page(props: Props) {
  const searchParams = await props.searchParams;

  const { order, page } = searchParams;

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
          <SortOrder options={Object.entries(EnrollmentSortingOrder)} />
        </div>
        <Suspense
          key={JSON.stringify(searchParams)}
          fallback={<EnrollmentsListSkeleton length={enrollmentsPerPage} />}
        >
          <Enrollments
            userId={session.user.id}
            order={order as keyof typeof EnrollmentSortingOrder}
            page={currentPage}
          />
        </Suspense>
      </div>
    </main>
  );
}

async function Enrollments({ userId, order, page }: Parameters<typeof getUserEnrollments>[0]) {
  const [enrollments, count] = await Promise.all([
    getUserEnrollments({ userId, order, page, enrollmentsPerPage }),
    getUserEnrollmentsCount({ userId }),
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

const enrollmentsPerPage = 8;
