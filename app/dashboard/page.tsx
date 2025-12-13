import { redirect } from 'next/navigation';
import { getSession } from '@/app/lib/auth.get-session';
import UserAvatar from '@/app/components/user-avatar';
import { getCourses } from '@/app/data/course/get-courses';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/app/components/ui/carousel';
import CourseCard, { CourseCardSkeleton } from '@/app/(public)/courses/course-card';
import UserCourseCard, {
  CourseCardSkeleton as UserCourseCardSkeleton,
} from './courses/course-card';
import { Suspense } from 'react';
import { getEnrollments } from '@/app/data/enrollment/get-enrollments';
import { Button } from '@/app/components/ui/button';
import Link from 'next/link';
import { prisma } from '@/app/lib/prisma';
import { Skeleton } from '@/app/components/ui/skeleton';

export default async function Page() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <main className="space-y-8">
      <div className="flex items-center justify-center gap-x-4">
        <UserAvatar src={session.user.image} width={50} height={50} />
        <h2 className="text-center text-2xl font-semibold">
          Welcome back, {session.user.name || session.user.email}
        </h2>
      </div>
      <Suspense fallback={<EnrolledCoursesSkeleton />}>
        <EnrolledCourses userId={session.user.id} />
      </Suspense>
      <Suspense fallback={<CoursesSkeleton />}>
        <CategoryCourses userId={session.user.id} />
      </Suspense>
      <Suspense fallback={<CoursesSkeleton />}>
        <OtherCourses userId={session.user.id} />
      </Suspense>
    </main>
  );
}

async function EnrolledCourses({ userId }: { userId: string }) {
  const enrollments = await getEnrollments({ filters: { userId } });

  if (enrollments.length === 0) {
    return (
      <div className="space-y-8 text-center">
        <h2 className="text-2xl font-bold">Let&apos;s start learning</h2>
        <p className="text-muted-foreground">You don&apos;t have any courses yet</p>
        <Button asChild>
          <Link href="/courses">View all courses</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-center text-2xl font-bold">Let&apos;s start learning</h2>
      <Carousel className="w-full">
        <CarouselContent className="-ml-2">
          {enrollments.map(({ course }) => (
            <CarouselItem key={course.id} className="pl-2 md:basis-1/2 lg:basis-1/3">
              <UserCourseCard course={course} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-4" />
        <CarouselNext className="-right-4" />
      </Carousel>
    </div>
  );
}

async function CategoryCourses({ userId }: { userId: string }) {
  const categories = await prisma.category.findMany({
    where: { courses: { some: { enrollments: { some: { userId } } } } },
  });

  const randomIndex = Math.floor(Math.random() * categories.length);

  const category = categories[randomIndex];

  const courses = await getCourses({
    filters: { categoryName: category.name, notEnrolledByUserId: userId },
  });

  if (courses.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      <h2 className="text-center text-2xl font-bold">More from {category.name}</h2>
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
    </div>
  );
}

async function OtherCourses({ userId }: { userId: string }) {
  const courses = await getCourses({ filters: { notEnrolledByUserId: userId } });

  if (courses.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      <h2 className="text-center text-2xl font-bold">Other courses</h2>
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
    </div>
  );
}

function EnrolledCoursesSkeleton() {
  return (
    <div className="space-y-8">
      <h2 className="text-center text-2xl font-bold">Let&apos;s start learning</h2>
      <div className="-ml-2 flex overflow-hidden">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="w-full shrink-0 pl-2 md:basis-1/2 lg:basis-1/3">
            <UserCourseCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}

function CoursesSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="mx-auto h-8 w-40" />
      <div className="-ml-2 flex overflow-hidden">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="w-full shrink-0 pl-2 md:basis-1/2 lg:basis-1/3">
            <CourseCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}
