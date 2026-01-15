import StarRating, { StarRatingSkeleton } from '@/app/components/star-rating';
import { Skeleton } from '@/app/components/ui/skeleton';
import UserAvatar from '@/app/components/user-avatar';
import type { ReviewSummary } from '@/app/lib/definitions';

export default function ReviewCard({ review }: { review: ReviewSummary }) {
  return (
    <article className="bg-card text-card-foreground space-y-4 rounded-lg border p-4 shadow-md">
      <div className="flex items-center gap-x-2">
        <UserAvatar src={review.user.image} width={40} height={40} className="size-10" />
        <h4 className="font-medium">{review.user.name ?? 'Anonymous user'}</h4>
      </div>
      <StarRating rating={review.rating} />
      {review.title && <h4 className="font-semibold">{review.title}</h4>}
      {review.description && <p>{review.description}</p>}
    </article>
  );
}

export function ReviewCardSkeleton() {
  return (
    <article className="bg-card text-card-foreground space-y-4 rounded-lg border p-4 shadow-md">
      <div className="flex items-center gap-x-2">
        <Skeleton className="size-10 rounded-full" />
        <Skeleton className="h-6 w-24" />
      </div>
      <StarRatingSkeleton />
      <Skeleton className="h-6 w-1/2" />
      <Skeleton className="h-12 w-full" />
    </article>
  );
}
