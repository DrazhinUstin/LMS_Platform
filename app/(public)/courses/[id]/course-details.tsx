import { formatPrice, getS3ObjectUrl } from '@/app/lib/utils';
import {
  ChevronsUpDownIcon,
  ClockIcon,
  InfinityIcon,
  MonitorSmartphoneIcon,
  TableOfContentsIcon,
} from 'lucide-react';
import Image from 'next/image';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/app/components/ui/collapsible';
import { Button } from '@/app/components/ui/button';
import CategoryIcon from '@/app/components/category-icon';
import LevelIcon from '@/app/components/level-icon';
import { Suspense } from 'react';
import CourseEnrollment, { CourseEnrollmentFallback } from './course-enrollment';
import StarRating from '@/app/components/star-rating';
import Link from 'next/link';
import type { CourseDetail } from '@/app/lib/definitions';

export default function CourseDetails({ course }: { course: CourseDetail }) {
  return (
    <div className="grid items-start gap-8 lg:grid-cols-3">
      <div className="space-y-8 lg:col-span-2">
        <div className="relative aspect-video w-full">
          <Image
            src={getS3ObjectUrl(course.previewImageKey)}
            alt={course.title}
            fill
            sizes="(min-width: 1024px) 75vw, 100vw"
            className="rounded-lg object-cover"
            priority
          />
        </div>
        <h2 className="text-2xl font-bold">{course.title}</h2>
        <div className="flex items-center gap-x-2">
          <Link href={`/courses/${course.id}/reviews`}>
            <StarRating rating={course.avgRating ?? 0} size="lg" />
          </Link>
          <Link
            href={`/courses/${course.id}/reviews`}
            className="text-muted-foreground text-sm hover:underline"
          >
            ({course._count.reviews} reviews)
          </Link>
        </div>
        <p>{course.briefDescription}</p>
        <hr />
        <ul className="flex flex-wrap gap-x-4 gap-y-2">
          <li className="flex items-center gap-x-2">
            <span className="bg-primary/20 text-primary grid size-10 place-items-center rounded-full">
              <CategoryIcon categoryName={course.categoryName} className="size-5" />
            </span>
            <div>
              <h4 className="text-sm font-medium">Category</h4>
              <p className="text-muted-foreground text-sm">{course.categoryName}</p>
            </div>
          </li>
          <li className="flex items-center gap-x-2">
            <span className="bg-primary/20 text-primary grid size-10 place-items-center rounded-full">
              <LevelIcon level={course.level} className="size-5" />
            </span>
            <div>
              <h4 className="text-sm font-medium">Level</h4>
              <p className="text-muted-foreground text-sm">{course.level}</p>
            </div>
          </li>
          <li className="flex items-center gap-x-2">
            <span className="bg-primary/20 text-primary grid size-10 place-items-center rounded-full">
              <ClockIcon className="size-5" />
            </span>
            <div>
              <h4 className="text-sm font-medium">Duration</h4>
              <p className="text-muted-foreground text-sm">{course.duration} hr</p>
            </div>
          </li>
        </ul>
        <hr />
        <h2 className="text-2xl font-bold">Course description</h2>
        <div
          className="prose prose-neutral prose-sm sm:prose-base dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: course.description }}
        />
        <hr />
        <h2 className="text-2xl font-bold">Course structure</h2>
        <div className="space-y-4">
          {course.chapters.map((chapter, chapterIndex) => (
            <Collapsible
              key={chapter.id}
              className="rounded-sm border shadow-sm"
              defaultOpen={chapterIndex === 0}
            >
              <div className="grid grid-cols-[1fr_auto] items-center p-2">
                <div className="space-y-1">
                  <h4 className="font-medium">
                    Chapter {chapterIndex + 1}{' '}
                    <span className="text-muted-foreground text-sm font-normal">
                      - {chapter._count.lessons} lessons
                    </span>
                  </h4>
                  <p className="text-muted-foreground">{chapter.title}</p>
                </div>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <ChevronsUpDownIcon />
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent className="space-y-2 border-t p-2 pl-4">
                {chapter.lessons.map((lesson, lessonIndex) => (
                  <div key={lesson.id} className="space-y-1">
                    <h4 className="font-medium">Lesson {lessonIndex + 1}</h4>
                    <p className="text-muted-foreground">{lesson.title}</p>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>
      <div className="rounded-sm border shadow-sm lg:sticky lg:top-28">
        <div className="p-4">
          <h3 className="flex justify-between text-xl font-semibold">
            Buy for
            <span className="text-muted-foreground">{formatPrice(course.price / 100)}</span>
          </h3>
        </div>
        <div className="space-y-4 border-t p-4">
          <h4 className="font-medium">What you will get</h4>
          <ul className="space-y-2">
            <li className="grid grid-cols-[auto_1fr] items-center gap-x-2">
              <span className="bg-primary/20 text-primary grid size-10 place-items-center rounded-full">
                <ClockIcon className="size-5" />
              </span>
              <p>{course.duration} hr length course</p>
            </li>
            <li className="grid grid-cols-[auto_1fr] items-center gap-x-2">
              <span className="bg-primary/20 text-primary grid size-10 place-items-center rounded-full">
                <TableOfContentsIcon className="size-5" />
              </span>
              <p>
                {course._count.chapters} chapters with{' '}
                {course.chapters.reduce((acc, chapter) => acc + chapter._count.lessons, 0)} lessons
              </p>
            </li>
            <li className="grid grid-cols-[auto_1fr] items-center gap-x-2">
              <span className="bg-primary/20 text-primary grid size-10 place-items-center rounded-full">
                <InfinityIcon className="size-5" />
              </span>
              <p>Lifetime access</p>
            </li>
            <li className="grid grid-cols-[auto_1fr] items-center gap-x-2">
              <span className="bg-primary/20 text-primary grid size-10 place-items-center rounded-full">
                <MonitorSmartphoneIcon className="size-5" />
              </span>
              <p>Available on mobile / desktop devices</p>
            </li>
          </ul>
          <Suspense fallback={<CourseEnrollmentFallback />}>
            <CourseEnrollment courseId={course.id} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
