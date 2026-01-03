import Link from 'next/link';
import { cn } from '@/app/lib/utils';
import { Suspense } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/app/components/ui/carousel';
import CourseCard, { CourseCardSkeleton } from './courses/course-card';
import { CourseSortingOrder } from '@/app/lib/definitions';
import { getCourses } from '@/app/data/course/get-courses';

interface Props {
  order?: keyof typeof CourseSortingOrder;
}

const tabsData: Array<{ label: string; value: Props['order'] }> = [
  { label: 'Most recent', value: 'CREATED_DESC' },
  { label: 'Most popular', value: 'POPULARITY_DESC' },
  { label: 'Top rated', value: 'RATING_DESC' },
];

export default function Featured({ order = 'CREATED_DESC' }: Props) {
  return (
    <div className="space-y-8">
      <h2 className="text-center text-2xl font-bold">Featured courses</h2>
      <nav className="flex border-b">
        {tabsData.map(({ label, value }) => (
          <Link
            key={value}
            href={`?featured_order=${value}`}
            className={cn(
              'text-muted-foreground relative px-2 py-1 font-medium',
              value === order &&
                'text-primary after:bg-primary after:absolute after:-bottom-[1px] after:left-0 after:h-[2px] after:w-full'
            )}
            scroll={false}
          >
            {label}
          </Link>
        ))}
      </nav>
      <Suspense key={order} fallback={<CoursesCarouselSkeleton />}>
        <CoursesCarousel order={order} />
      </Suspense>
    </div>
  );
}

const coursesCount = 4;

async function CoursesCarousel({ order }: Props) {
  const courses = await getCourses({
    filters: { status: 'PUBLISHED' },
    order,
    coursesPerPage: coursesCount,
  });
  return (
    <Carousel className="w-full">
      <CarouselContent className="-ml-2">
        {courses.map((course) => (
          <CarouselItem key={course.id} className="pl-2 md:basis-1/2 lg:basis-1/3">
            <CourseCard course={course} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="-left-4" />
      <CarouselNext className="-right-4" />
    </Carousel>
  );
}

function CoursesCarouselSkeleton() {
  return (
    <div className="-ml-2 flex overflow-hidden">
      {Array.from({ length: coursesCount }, (_, index) => (
        <div key={index} className="w-full shrink-0 pl-2 md:basis-1/2 lg:basis-1/3">
          <CourseCardSkeleton />
        </div>
      ))}
    </div>
  );
}
