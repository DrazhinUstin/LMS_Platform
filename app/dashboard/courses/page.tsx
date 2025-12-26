import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import PaginationBar from '@/app/components/pagination-bar';
import SortOrder from '@/app/components/sort-order';
import CourseCard, { CourseCardSkeleton } from './course-card';
import type { Metadata } from 'next';
import { getSession } from '@/app/lib/auth.get-session';
import { EnrollmentSortingOrder } from '@/app/lib/definitions';
import { getUserEnrollments } from '@/app/data/enrollment/get-user-enrollments';
import { getUserEnrollmentsCount } from '@/app/data/enrollment/get-user-enrollments-count';

export const metadata: Metadata = {
  title: 'Courses',
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
      <h2 className="text-center text-2xl font-bold">Courses you are enrolled in</h2>
      <div className="space-y-8">
        <div className="flex justify-end">
          <SortOrder options={Object.entries(EnrollmentSortingOrder)} />
        </div>
        <Suspense key={JSON.stringify(searchParams)} fallback={<CoursesGridSkeleton />}>
          <CoursesGrid
            userId={session.user.id}
            order={order as keyof typeof EnrollmentSortingOrder}
            page={currentPage}
          />
        </Suspense>
      </div>
    </main>
  );
}

async function CoursesGrid({ userId, order, page }: Parameters<typeof getUserEnrollments>[0]) {
  const [enrollments, count] = await Promise.all([
    getUserEnrollments({ userId, order, page, enrollmentsPerPage }),
    getUserEnrollmentsCount({ userId }),
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

const enrollmentsPerPage = 8;
