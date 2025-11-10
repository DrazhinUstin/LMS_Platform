'use client';

import type { CourseTypeWithInclude } from '@/app/data/course/get-course';
import { Button } from '@/app/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/app/components/ui/collapsible';
import Link from 'next/link';
import { ChevronsUpDownIcon, PlayIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/app/lib/utils';

export default function CourseStructure({ course }: { course: CourseTypeWithInclude }) {
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
                  'justify-normal',
                  pathname.endsWith(lesson.id) &&
                    'bg-accent text-accent-foreground dark:bg-input/50'
                )}
                asChild
              >
                <Link href={`/customer/courses/${course.id}/${chapter.id}/${lesson.id}`}>
                  <span className="bg-primary/10 grid size-6 shrink-0 place-items-center rounded-full">
                    <PlayIcon />
                  </span>
                  <span className="truncate">
                    {lessonIndex + 1}. {lesson.title}
                  </span>
                </Link>
              </Button>
            ))}
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
}
