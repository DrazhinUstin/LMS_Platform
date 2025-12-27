import PaginationBar from '@/app/components/pagination-bar';
import SortOrder from '@/app/components/sort-order';
import { getReviews } from '@/app/data/review/get-reviews';
import { getReviewsCount } from '@/app/data/review/get-reviews-count';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/app/lib/auth.get-session';
import ReviewCard, { ReviewCardSkeleton } from './review-card';
import { ReviewSortingOrder } from '@/app/lib/definitions';

export const metadata: Metadata = {
  title: 'Reviews',
};

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page(props: Props) {
  const searchParams = await props.searchParams;

  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const { order, page, ...filters } = searchParams;

  const currentPage = Number(page) || 1;

  return (
    <main className="space-y-8">
      <h2 className="text-center text-2xl font-bold">Your Reviews</h2>
      <div className="space-y-8">
        <div className="flex justify-end">
          <SortOrder options={Object.entries(ReviewSortingOrder)} />
        </div>
        <Suspense key={JSON.stringify(searchParams)} fallback={<ReviewsGridSkeleton />}>
          <ReviewsGrid
            filters={{ ...filters, userId: session.user.id }}
            order={order as keyof typeof ReviewSortingOrder}
            page={currentPage}
          />
        </Suspense>
      </div>
    </main>
  );
}

async function ReviewsGrid({ filters, order, page }: Parameters<typeof getReviews>[0]) {
  const [reviews, count] = await Promise.all([
    getReviews({ filters, order, page, reviewsPerPage }),
    getReviewsCount({ filters }),
  ]);

  const totalPages = Math.ceil(count / reviewsPerPage);

  return (
    <div>
      <div className="grid items-start gap-8 lg:grid-cols-2">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
      {reviews.length === 0 && (
        <p className="text-center">Unfortunately, you don&apos;t have any reviews yet 😞</p>
      )}
      <PaginationBar currentPage={page as number} totalPages={totalPages} className="mt-8" />
    </div>
  );
}

function ReviewsGridSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {Array.from({ length: reviewsPerPage }).map((_, index) => (
        <ReviewCardSkeleton key={index} />
      ))}
    </div>
  );
}

const reviewsPerPage = 8;
