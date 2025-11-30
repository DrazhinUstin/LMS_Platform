import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';
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
import CourseCard, { CourseCardSkeleton } from './course-card';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Courses',
};

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page(props: Props) {
  const searchParams = await props.searchParams;

  const { orderBy, page, ...filters } = searchParams;

  const parsedOrderBy = orderBy && !Array.isArray(orderBy) ? JSON.parse(orderBy) : undefined;

  const currentPage = Number(page) || 1;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/login');
  }

  return (
    <main className="space-y-8">
      <h2 className="text-center text-2xl font-bold">Courses you are enrolled in</h2>
      <div className="space-y-8">
        <div className="flex justify-end">
          <SortOrder options={enrollmentSortingOrderData} />
        </div>
        <Suspense key={JSON.stringify(searchParams)} fallback={<CoursesGridSkeleton />}>
          <CoursesGrid
            filters={{ ...filters, userId: session.user.id }}
            orderBy={parsedOrderBy}
            page={currentPage}
          />
        </Suspense>
      </div>
    </main>
  );
}

async function CoursesGrid({ filters, orderBy, page }: Parameters<typeof getEnrollments>[0]) {
  const [enrollments, count] = await Promise.all([
    getEnrollments({ filters, orderBy, page }),
    getEnrollmentsCount({ filters }),
  ]);

  const totalPages = Math.ceil(count / enrollmentsPerPage);

  return (
    <div>
      <div className="grid grid-cols-[repeat(auto-fill,_minmax(280px,_1fr))] items-start gap-8">
        {enrollments.map(({ course }) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
      {enrollments.length === 0 && (
        <p className="text-center">Unfortunately, no enrolled courses were found 😞</p>
      )}
      <PaginationBar currentPage={page as number} totalPages={totalPages} className="mt-8" />
    </div>
  );
}

function CoursesGridSkeleton() {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,_minmax(280px,_1fr))] gap-8">
      {Array.from({ length: enrollmentsPerPage }).map((_, index) => (
        <CourseCardSkeleton key={index} />
      ))}
    </div>
  );
}
