import { Badge } from '@/app/components/ui/badge';
import { formatPrice, getS3ObjectUrl } from '@/app/lib/utils';
import { ClockIcon, EllipsisIcon, EyeIcon, SquarePenIcon, Trash2Icon } from 'lucide-react';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { Button } from '@/app/components/ui/button';
import Link from 'next/link';
import { Skeleton } from '@/app/components/ui/skeleton';
import CategoryIcon from '@/app/components/category-icon';
import LevelIcon from '@/app/components/level-icon';
import type { CourseSummary } from '@/app/lib/definitions';
import StarRating from '@/app/components/star-rating';

export default function CourseCard({ course }: { course: CourseSummary }) {
  return (
    <article className="relative rounded-lg shadow-md">
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="absolute top-2 right-2 z-50">
          <Button variant="outline" size="icon">
            <EllipsisIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild>
            <Link href={`/courses/${course.id}`}>
              <EyeIcon />
              Preview
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/admin/courses/${course.id}/edit`}>
              <SquarePenIcon />
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/admin/courses/${course.id}/delete`}>
              <Trash2Icon className="text-destructive" />
              Delete
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
        <Image
          src={getS3ObjectUrl(course.previewImageKey)}
          alt="course preview image"
          fill
          sizes="(min-width: 808px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="space-y-2 rounded-b-lg border border-t-0 p-2">
        <h4 className="line-clamp-1 font-semibold">{course.title}</h4>
        <div className="flex items-center gap-x-2">
          <Link href={`/courses/${course.id}/reviews`}>
            <StarRating rating={course.avgRating ?? 0} />
          </Link>
          <Link
            href={`/courses/${course.id}/reviews`}
            className="text-muted-foreground text-sm hover:underline"
          >
            ({course._count.reviews} reviews)
          </Link>
        </div>
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
  );
}

export function CourseCardSkeleton() {
  return (
    <article className="relative rounded-lg shadow-md">
      <Skeleton className="aspect-video w-full rounded-none rounded-t-lg" />
      <div className="space-y-2 rounded-b-lg border border-t-0 p-2">
        <Skeleton className="h-6 w-3/4" />
        <div className="flex items-center gap-x-2">
          <StarRating rating={0} />
          <Skeleton className="h-5 w-20" />
        </div>
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
