import PaginationBar from '@/app/components/pagination-bar';
import SortOrder from '@/app/components/sort-order';
import { getCourse } from '@/app/data/course/get-course';
import { getReviews, reviewsPerPage } from '@/app/data/review/get-reviews';
import { getReviewsCount } from '@/app/data/review/get-reviews-count';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import ReviewCard, { ReviewCardSkeleton } from './review-card';
import { reviewSortingOrderData } from '@/app/lib/sorting-order-data';

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

  const { orderBy, page, ...filters } = searchParams;

  const parsedOrderBy = orderBy && !Array.isArray(orderBy) ? JSON.parse(orderBy) : undefined;

  const currentPage = Number(page) || 1;

  return (
    <main>
      <h2 className="text-center text-2xl font-bold">All Reviews</h2>
      <div className="space-y-8">
        <div className="flex justify-end">
          <SortOrder options={reviewSortingOrderData} />
        </div>
        <Suspense key={JSON.stringify(searchParams)} fallback={<ReviewsGridSkeleton />}>
          <ReviewsGrid
            filters={{ ...filters, courseId: course.id }}
            orderBy={parsedOrderBy}
            page={currentPage}
          />
        </Suspense>
      </div>
    </main>
  );
}

async function ReviewsGrid({ filters, orderBy, page }: Parameters<typeof getReviews>[0]) {
  const [reviews, count] = await Promise.all([
    getReviews({ filters, orderBy, page }),
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
