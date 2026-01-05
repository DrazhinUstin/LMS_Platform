import CategoryIcon from '@/app/components/category-icon';
import LevelIcon from '@/app/components/level-icon';
import StarRating from '@/app/components/star-rating';
import type { UserCourseDetail } from '@/app/lib/definitions';
import { formatDate, getS3ObjectUrl } from '@/app/lib/utils';
import { Calendar1Icon, ClockIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CourseDetail({ course }: { course: UserCourseDetail }) {
  return (
    <div className="space-y-8">
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
      <ul className="grid gap-x-4 gap-y-8 border-t border-b py-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <li className="flex items-center gap-x-2">
          <span className="bg-primary/20 text-primary grid size-10 shrink-0 place-items-center rounded-full">
            <CategoryIcon categoryName={course.categoryName} className="size-5" />
          </span>
          <div>
            <h4 className="text-sm font-medium">Category</h4>
            <p className="text-muted-foreground text-sm">{course.categoryName}</p>
          </div>
        </li>
        <li className="flex items-center gap-x-2">
          <span className="bg-primary/20 text-primary grid size-10 shrink-0 place-items-center rounded-full">
            <LevelIcon level={course.level} className="size-5" />
          </span>
          <div>
            <h4 className="text-sm font-medium">Level</h4>
            <p className="text-muted-foreground text-sm">{course.level}</p>
          </div>
        </li>
        <li className="flex items-center gap-x-2">
          <span className="bg-primary/20 text-primary grid size-10 shrink-0 place-items-center rounded-full">
            <ClockIcon className="size-5" />
          </span>
          <div>
            <h4 className="text-sm font-medium">Duration</h4>
            <p className="text-muted-foreground text-sm">{course.duration} hr</p>
          </div>
        </li>
        <li className="flex items-center gap-x-2">
          <span className="bg-primary/20 text-primary grid size-10 shrink-0 place-items-center rounded-full">
            <Calendar1Icon className="size-5" />
          </span>
          <div>
            <h4 className="text-sm font-medium">Last updated</h4>
            <p className="text-muted-foreground text-sm">{formatDate(course.updatedAt)}</p>
          </div>
        </li>
      </ul>
      <h2 className="text-2xl font-bold">Course description</h2>
      <div
        className="prose prose-neutral prose-sm sm:prose-base dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: course.description }}
      />
    </div>
  );
}
