import { Badge } from '@/app/components/ui/badge';
import { formatPrice, getS3ObjectUrl } from '@/app/lib/utils';
import { Course } from '@/generated/prisma';
import {
  BadgeCheckIcon,
  BookOpenIcon,
  ClockIcon,
  EllipsisIcon,
  EyeIcon,
  SquarePenIcon,
  Trash2Icon,
} from 'lucide-react';
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

export default function CourseCard({ course }: { course: Course }) {
  return (
    <article className="relative rounded-lg shadow-md">
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="absolute top-2 right-2">
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
      <Image
        src={getS3ObjectUrl(course.previewImageKey)}
        alt="course preview image"
        width={600}
        height={400}
        className="aspect-video w-full rounded-t-lg object-cover"
      />
      <div className="space-y-2 rounded-b-lg border border-t-0 p-2">
        <h4 className="line-clamp-1 font-semibold">{course.title}</h4>
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
