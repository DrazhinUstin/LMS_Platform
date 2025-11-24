import type { EnrollmentTypeWithSelect } from '@/app/data/enrollment/get-enrollments';
import { Badge } from '@/app/components/ui/badge';
import { Skeleton } from '@/app/components/ui/skeleton';
import { getS3ObjectUrl } from '@/app/lib/utils';
import { ClockIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Progress } from '@/app/components/ui/progress';
import CategoryIcon from '@/app/components/category-icon';
import LevelIcon from '@/app/components/level-icon';

export default function CourseCard({ course }: { course: EnrollmentTypeWithSelect['course'] }) {
  const totalLessons = course.chapters.reduce((acc, chapter) => acc + chapter._count.lessons, 0);

  const totalCompletedLessons = course.chapters.reduce((acc, chapter) => {
    let chapterLessonsCompleted = 0;

    chapter.lessons.forEach(
      (lesson) => lesson.userProgresses[0]?.isCompleted && chapterLessonsCompleted++
    );

    return acc + chapterLessonsCompleted;
  }, 0);

  return (
    <Link href={`/customer/courses/${course.id}`}>
      <article className="group relative rounded-lg shadow-md">
        <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
          <Image
            src={getS3ObjectUrl(course.previewImageKey)}
            alt="course preview image"
            fill
            sizes="(min-width: 808px) 50vw, 100vw"
            className="object-cover transition-transform duration-1000 group-hover:scale-125"
          />
        </div>
        <div className="space-y-2 rounded-b-lg border border-t-0 p-2">
          <h4 className="line-clamp-1 font-semibold">{course.title}</h4>
          <p className="text-muted-foreground line-clamp-3 text-sm">{course.briefDescription}</p>
          <div className="flex flex-wrap items-center gap-2">
            <Badge>
              <CategoryIcon categoryName={course.categoryName} />
              {course.categoryName}
            </Badge>
            <Badge variant="secondary">
              <LevelIcon level={course.level} />
              {course.level}
            </Badge>
            <Badge variant="outline">
              <ClockIcon />
              {course.duration} min
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs">
              {totalCompletedLessons} out of {totalLessons} lessons completed
            </p>
            <Progress value={(totalCompletedLessons / totalLessons) * 100} />
          </div>
        </div>
      </article>
    </Link>
  );
}

export function CourseCardSkeleton() {
  return (
    <article className="relative rounded-lg shadow-md">
      <Skeleton className="aspect-video w-full rounded-none rounded-t-lg" />
      <div className="space-y-2 rounded-b-lg border border-t-0 p-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-8 w-full" />
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-16" />
        </div>
        <div className="space-y-1">
          <Skeleton className="h-2 w-1/2" />
          <Skeleton className="h-2 w-full" />
        </div>
      </div>
    </article>
  );
}
