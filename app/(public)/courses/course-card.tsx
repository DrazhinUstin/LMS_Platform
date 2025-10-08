import { Badge } from '@/app/components/ui/badge';
import { Skeleton } from '@/app/components/ui/skeleton';
import { formatPrice, getS3ObjectUrl } from '@/app/lib/utils';
import type { Course } from '@/generated/prisma';
import { BadgeCheckIcon, BookOpenIcon, ClockIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CourseCard({ course }: { course: Course }) {
  return (
    <article className="relative rounded-lg shadow-md">
      <Image
        src={getS3ObjectUrl(course.previewImageKey)}
        alt="course preview image"
        width={600}
        height={400}
        className="aspect-video w-full rounded-t-lg"
      />
      <div className="space-y-2 rounded-b-lg border border-t-0 p-2">
        <h4 className="line-clamp-1 font-semibold">
          <Link href={`/courses/${course.id}`} className="hover:text-primary transition-colors">
            {course.title}
          </Link>
        </h4>
        <p className="text-muted-foreground line-clamp-3 text-sm">{course.briefDescription}</p>
        <p className="font-medium">{formatPrice(course.price / 100)}</p>
        <div className="flex flex-wrap items-center gap-2">
          <Badge>
            <BadgeCheckIcon />
            {course.categoryName}
          </Badge>
          <Badge variant="secondary">
            <BookOpenIcon />
            {course.level}
          </Badge>
          <Badge variant="outline">
            <ClockIcon />
            {course.duration} min
          </Badge>
        </div>
      </div>
    </article>
  );
}

export function CourseCardSkeleton() {
  return (
    <article className="relative rounded-lg shadow-md">
      <Skeleton className="aspect-video w-full rounded-t-lg" />
      <div className="space-y-2 rounded-b-lg border border-t-0 p-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-4 w-20" />
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </article>
  );
}
