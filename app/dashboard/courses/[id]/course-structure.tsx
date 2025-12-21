'use client';

import { Button } from '@/app/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/app/components/ui/collapsible';
import Link from 'next/link';
import { ChevronsUpDownIcon, CircleCheckIcon, PlayIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/app/lib/utils';
import type { UserCourseDetail } from '@/app/lib/definitions';

export default function CourseStructure({ course }: { course: UserCourseDetail }) {
  const pathname = usePathname();
  return (
    <div className="space-y-2">
      {course.chapters.map((chapter, chapterIndex) => (
        <Collapsible key={chapter.id} defaultOpen={pathname.includes(chapter.id)}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="flex h-auto justify-normal" asChild>
              <div>
                <ChevronsUpDownIcon />
                <div className="truncate">
                  <h4>
                    {chapterIndex + 1}. {chapter.title}
                  </h4>
                  <p className="text-muted-foreground font-normal">
                    {chapter._count.lessons} lessons
                  </p>
                  {chapter.lessons.reduce(
                    (acc, lesson) => acc + (lesson.userProgresses[0]?.isCompleted ? 1 : 0),
                    0
                  ) === chapter._count.lessons && (
                    <p className="flex items-center gap-x-0.5 text-xs font-normal text-green-600">
                      <CircleCheckIcon className="size-3 text-green-600" />
                      Completed
                    </p>
                  )}
                </div>
              </div>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="flex flex-col gap-y-2 p-2 pb-0">
            {chapter.lessons.map((lesson, lessonIndex) => (
              <Button
                key={lesson.id}
                variant="outline"
                className={cn(
                  'flex h-auto justify-normal',
                  pathname.endsWith(lesson.id) &&
                    'bg-accent text-accent-foreground dark:bg-input/50'
                )}
                asChild
              >
                <Link href={`/dashboard/courses/${course.id}/${chapter.id}/${lesson.id}`}>
                  <span className="bg-primary/10 grid size-6 shrink-0 place-items-center rounded-full">
                    <PlayIcon />
                  </span>
                  <div className="truncate">
                    <h4>
                      {lessonIndex + 1}. {lesson.title}
                    </h4>
                    {lesson.userProgresses[0]?.isCompleted && (
                      <p className="flex items-center gap-x-0.5 text-xs font-normal text-green-600">
                        <CircleCheckIcon className="size-3 text-green-600" />
                        Completed
                      </p>
                    )}
                  </div>
                </Link>
              </Button>
            ))}
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
}
