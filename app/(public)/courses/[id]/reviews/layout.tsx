import { getCourse } from '@/app/data/course/get-course';
import { getEnrollment } from '@/app/data/enrollment/get-enrollment';
import { getReview } from '@/app/data/review/get-review';
import { getSession } from '@/app/lib/auth.get-session';
import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { formatDate, getS3ObjectUrl } from '@/app/lib/utils';
import ReviewCard from './review-card';
import EditReviewDialog from './edit-review-dialog';
import DeleteReviewDialog from './delete-review-dialog';
import CreateReviewDialog from './create-review-dialog';
import StarRating from '@/app/components/star-rating';

interface Props {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}

export default async function Layout({ params, children }: Props) {
  const [{ id }, session] = await Promise.all([params, getSession()]);

  const [course, userReview, userEnrollment] = await Promise.all([
    getCourse(id),
    session?.user.id ? getReview({ userId: session.user.id, courseId: id }) : null,
    session?.user.id ? getEnrollment({ userId: session.user.id, courseId: id }) : null,
  ]);

  if (!course) notFound();

  return (
    <div className="mx-auto w-[90vw] max-w-7xl space-y-8 py-8">
      <Link
        href={`/courses/${course.id}`}
        className="hover:text-primary flex w-max items-center gap-x-4 transition-colors"
      >
        <ArrowLeftIcon />
        <div className="relative aspect-video w-20 shrink-0">
          <Image
            src={getS3ObjectUrl(course.previewImageKey)}
            alt={course.title}
            fill
            sizes="80px"
            className="rounded-sm object-cover"
          />
        </div>
        <h4 className="font-semibold">{course.title}</h4>
      </Link>
      <div className="flex items-center gap-x-2">
        <StarRating rating={course.avgRating ?? 0} size="lg" />
        <span className="text-muted-foreground text-sm">({course._count.reviews} reviews)</span>
      </div>
      {userReview ? (
        <div className="space-y-4">
          <p>You reviewed this course on {formatDate(userReview.createdAt)}</p>
          <div className="max-w-[600px]">
            <ReviewCard review={userReview} />
          </div>
          <p>Do you want to edit it or delete it?</p>
          <div className="space-x-4">
            <EditReviewDialog review={userReview} />
            <DeleteReviewDialog review={userReview} />
          </div>
        </div>
      ) : userEnrollment ? (
        <div>
          <CreateReviewDialog courseId={course.id} />
        </div>
      ) : null}
      {children}
    </div>
  );
}
