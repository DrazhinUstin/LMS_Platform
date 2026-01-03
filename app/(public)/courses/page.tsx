import Filters from './filters';
import SortOrder from '@/app/components/sort-order';
import { getCourses } from '@/app/data/course/get-courses';
import { Suspense } from 'react';
import CourseCard, { CourseCardSkeleton } from './course-card';
import { getCategories } from '@/app/data/category/get-categories';
import getCoursesCount from '@/app/data/course/get-courses-count';
import PaginationBar from '@/app/components/pagination-bar';
import type { Metadata } from 'next';
import { CourseSortingOrder } from '@/app/lib/definitions';

export const metadata: Metadata = {
  title: 'Courses',
};

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page({ searchParams }: Props) {
  const awaitedSearchParams = await searchParams;

  const { order, page, ...filters } = awaitedSearchParams;

  const currentPage = Number(page) || 1;

  const categories = await getCategories();

  return (
    <main className="mx-auto w-[90vw] max-w-7xl space-y-8 py-8">
      <h2 className="text-center text-2xl font-bold">Courses</h2>
      <div className="grid gap-8 lg:grid-cols-[auto_1fr] lg:items-start">
        <div className="lg:sticky lg:top-[7rem] lg:w-60">
          <Filters categories={categories} />
        </div>
        <div className="space-y-8">
          <div className="flex justify-end">
            <SortOrder options={Object.entries(CourseSortingOrder)} />
          </div>
          <Suspense key={JSON.stringify(awaitedSearchParams)} fallback={<CoursesGridSkeleton />}>
            <CoursesGrid
              filters={{ ...filters, status: 'PUBLISHED' }}
              order={order as keyof typeof CourseSortingOrder}
              page={currentPage}
            />
          </Suspense>
        </div>
      </div>
    </main>
  );
}

async function CoursesGrid({ filters, order, page }: Parameters<typeof getCourses>[0]) {
  const [courses, count] = await Promise.all([
    getCourses({ filters, order, page, coursesPerPage }),
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
        <p className="text-center">Unfortunately, no courses matching your query were found 😞</p>
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

const coursesPerPage = 8;
