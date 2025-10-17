import type { CourseTypeWithInclude } from '@/app/data/course/get-course';
import { formatPrice, getS3ObjectUrl } from '@/app/lib/utils';
import {
  ChevronsUpDownIcon,
  ClockIcon,
  CreditCardIcon,
  GraduationCapIcon,
  InfinityIcon,
  LayoutGridIcon,
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

export default function CourseDetails({ course }: { course: CourseTypeWithInclude }) {
  return (
    <div className="grid items-start gap-8 lg:grid-cols-3">
      <div className="space-y-8 lg:col-span-2">
        <Image
          src={getS3ObjectUrl(course.previewImageKey)}
          alt={course.title}
          width={1000}
          height={1000}
          priority
        />
        <h2 className="text-2xl font-bold">{course.title}</h2>
        <p>{course.briefDescription}</p>
        <hr />
        <ul className="flex flex-wrap gap-x-4 gap-y-2">
          <li className="flex items-center gap-x-2">
            <span className="bg-primary/20 text-primary grid size-10 place-items-center rounded-full">
              <LayoutGridIcon className="size-5" />
            </span>
            <div>
              <h4 className="text-sm font-medium">Category</h4>
              <p className="text-muted-foreground text-sm">{course.categoryName}</p>
            </div>
          </li>
          <li className="flex items-center gap-x-2">
            <span className="bg-primary/20 text-primary grid size-10 place-items-center rounded-full">
              <GraduationCapIcon className="size-5" />
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
              <p className="text-muted-foreground text-sm">{course.duration} min</p>
            </div>
          </li>
        </ul>
        <hr />
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
              <p>{course.duration} min length course</p>
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
          <Button className="w-full">
            <CreditCardIcon />
            Buy now
          </Button>
        </div>
      </div>
    </div>
  );
}
