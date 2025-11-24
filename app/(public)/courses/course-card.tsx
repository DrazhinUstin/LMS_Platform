import CategoryIcon from '@/app/components/category-icon';
import LevelIcon from '@/app/components/level-icon';
import { Badge } from '@/app/components/ui/badge';
import { Skeleton } from '@/app/components/ui/skeleton';
import { formatPrice, getS3ObjectUrl } from '@/app/lib/utils';
import type { Course } from '@/generated/prisma';
import { ClockIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CourseCard({ course }: { course: Course }) {
  return (
    <Link href={`/courses/${course.id}`}>
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
          <p className="font-medium">{formatPrice(course.price / 100)}</p>
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
        <Skeleton className="h-6 w-20" />
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-16" />
        </div>
      </div>
    </article>
  );
}
