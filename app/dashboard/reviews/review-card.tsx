import StarRating, { StarRatingSkeleton } from '@/app/components/star-rating';
import { Skeleton } from '@/app/components/ui/skeleton';
import type { ReviewSummary } from '@/app/lib/definitions';
import Link from 'next/link';
import Image from 'next/image';
import { getS3ObjectUrl } from '@/app/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { Button } from '@/app/components/ui/button';
import { EllipsisIcon } from 'lucide-react';
import EditReviewDialog from '@/app/(public)/courses/[id]/reviews/edit-review-dialog';
import DeleteReviewDialog from '@/app/(public)/courses/[id]/reviews/delete-review-dialog';

export default function ReviewCard({ review }: { review: ReviewSummary }) {
  return (
    <article className="bg-card text-card-foreground space-y-4 rounded-lg border p-4 shadow-md">
      <div className="grid grid-cols-[1fr_auto] gap-x-4">
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon-sm">
              <EllipsisIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <div>
              <EditReviewDialog review={review} className="w-full" />
            </div>
            <DropdownMenuSeparator />
            <div>
              <DeleteReviewDialog review={review} className="w-full" />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
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
      <div className="flex items-center gap-x-4">
        <Skeleton className="aspect-video w-20" />
        <Skeleton className="h-6 w-1/2" />
      </div>
      <StarRatingSkeleton />
      <Skeleton className="h-6 w-1/2" />
      <Skeleton className="h-12 w-full" />
    </article>
  );
}
