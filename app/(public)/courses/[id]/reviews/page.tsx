import PaginationBar from '@/app/components/pagination-bar';
import SortOrder from '@/app/components/sort-order';
import { getCourse } from '@/app/data/course/get-course';
import { getReviews } from '@/app/data/review/get-reviews';
import { getReviewsCount } from '@/app/data/review/get-reviews-count';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import ReviewCard, { ReviewCardSkeleton } from './review-card';
import { ReviewSortingOrder } from '@/app/lib/definitions';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).id;

  const course = await getCourse(id);

  if (!course) notFound();

  return {
    title: `Reviews - ${course.title}`,
    description: course.briefDescription,
  };
}

export default async function Page(props: Props) {
  const [{ id }, searchParams] = await Promise.all([props.params, props.searchParams]);

  const course = await getCourse(id);

  if (!course) notFound();

  const { order, page, ...filters } = searchParams;

  const currentPage = Number(page) || 1;

  return (
    <main className="space-y-8">
      <h2 className="text-center text-2xl font-bold">All Reviews</h2>
      <div className="space-y-8">
        <div className="flex justify-end">
          <SortOrder options={Object.entries(ReviewSortingOrder)} />
        </div>
        <Suspense key={JSON.stringify(searchParams)} fallback={<ReviewsGridSkeleton />}>
          <ReviewsGrid
            filters={{ ...filters, courseId: course.id }}
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
        <p className="text-center">Unfortunately, there are no reviews for this course 😞</p>
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
