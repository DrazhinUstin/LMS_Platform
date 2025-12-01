import CourseCard, { CourseCardSkeleton } from './course-card';
import { redirect } from 'next/navigation';
import SortOrder from '@/app/components/sort-order';
import { courseSortingOrderData, coursesPerPage, getCourses } from '@/app/data/course/get-courses';
import { Suspense } from 'react';
import getCoursesCount from '@/app/data/course/get-courses-count';
import PaginationBar from '@/app/components/pagination-bar';
import { Button } from '@/app/components/ui/button';
import Link from 'next/link';
import { SquarePenIcon } from 'lucide-react';
import type { Metadata } from 'next';
import { getSession } from '@/app/lib/auth.get-session';

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

  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <main className="space-y-8">
      <h2 className="text-center text-2xl font-bold">Created courses</h2>
      <div className="space-y-8">
        <div className="flex justify-end">
          <SortOrder options={courseSortingOrderData} />
        </div>
        <Suspense key={JSON.stringify(searchParams)} fallback={<CoursesGridSkeleton />}>
          <CoursesGrid
            filters={{ ...filters, authorId: session.user.id }}
            orderBy={parsedOrderBy}
            page={currentPage}
          />
        </Suspense>
      </div>
    </main>
  );
}

async function CoursesGrid({ filters, orderBy, page }: Parameters<typeof getCourses>[0]) {
  const [courses, count] = await Promise.all([
    getCourses({ filters, orderBy, page }),
    getCoursesCount({ filters }),
  ]);

  const totalPages = Math.ceil(count / coursesPerPage);

  return (
    <div>
      <div className="grid grid-cols-[repeat(auto-fill,_minmax(280px,_1fr))] items-start gap-8">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
      {courses.length === 0 && (
        <div className="space-y-4 text-center">
          <p>Unfortunately, no created courses were found 😞</p>
          <Button asChild>
            <Link href="/admin/courses/create">
              <SquarePenIcon />
              Quick create
            </Link>
          </Button>
        </div>
      )}
      <PaginationBar currentPage={page as number} totalPages={totalPages} className="mt-8" />
    </div>
  );
}

function CoursesGridSkeleton() {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,_minmax(280px,_1fr))] gap-8">
      {Array.from({ length: coursesPerPage }).map((_, index) => (
        <CourseCardSkeleton key={index} />
      ))}
    </div>
  );
}
