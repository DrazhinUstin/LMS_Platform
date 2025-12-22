import StarRating, { StarRatingSkeleton } from '@/app/components/star-rating';
import { Skeleton } from '@/app/components/ui/skeleton';
import type { ReviewSummary } from '@/app/lib/definitions';
import Link from 'next/link';
import Image from 'next/image';
import { formatDate, getS3ObjectUrl } from '@/app/lib/utils';
import UserAvatar from '@/app/components/user-avatar';

export default function ReviewCard({ review }: { review: ReviewSummary }) {
  return (
    <article className="rounded-lg border shadow-md">
      <div className="border-b p-4">
        <div className="flex items-center gap-x-4">
          <Link href={`/courses/${review.course.id}`}>
            <div className="relative aspect-video w-20 shrink-0">
              <Image
                src={getS3ObjectUrl(review.course.previewImageKey)}
                alt={review.course.title}
                fill
                sizes="80px"
                className="rounded-md object-cover"
              />
            </div>
          </Link>
          <h4 className="line-clamp-2 font-semibold">
            <Link
              href={`/courses/${review.course.id}`}
              className="hover:text-primary transition-colors"
            >
              {review.course.title}
            </Link>
          </h4>
        </div>
      </div>
      <div className="space-y-4 p-4">
        <div className="flex items-center gap-x-2">
          <UserAvatar src={review.user.image} width={40} height={40} className="size-10" />
          <div className="space-y-1">
            <h4 className="font-medium">{review.user.name ?? review.user.email}</h4>
            <p className="text-muted-foreground text-sm">On {formatDate(review.createdAt)}</p>
          </div>
        </div>
        <StarRating rating={review.rating} />
        {review.title && <h4 className="font-semibold">{review.title}</h4>}
        {review.description && <p>{review.description}</p>}
      </div>
    </article>
  );
}

export function ReviewCardSkeleton() {
  return (
    <article className="rounded-lg border shadow-md">
      <div className="border-b p-4">
        <div className="flex items-center gap-x-4">
          <Skeleton className="aspect-video w-20" />
          <Skeleton className="h-6 w-1/2" />
        </div>
      </div>
      <div className="space-y-4 p-4">
        <div className="flex items-center gap-x-2">
          <Skeleton className="size-10 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-5 w-32" />
          </div>
        </div>
        <StarRatingSkeleton />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-12 w-full" />
      </div>
    </article>
  );
}
