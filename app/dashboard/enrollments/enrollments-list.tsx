import { ShoppingCartIcon } from 'lucide-react';
import { cn, formatDate, formatPrice } from '@/app/lib/utils';
import Link from 'next/link';
import { Skeleton } from '@/app/components/ui/skeleton';
import type { UserEnrollmentSummary } from '@/app/lib/definitions';

export default function EnrollmentsList({ enrollments }: { enrollments: UserEnrollmentSummary[] }) {
  return (
    <ul className="text-sm lg:text-base">
      <li className="hidden grid-cols-[3fr_1fr_1fr] gap-2 border-b pb-2 font-semibold lg:grid">
        <span>Title</span>
        <span>Date</span>
        <span>Amount</span>
      </li>
      {enrollments.map((enrollment, index) => (
        <li
          key={enrollment.course.id}
          className={cn(
            'grid gap-2 border-b py-4 lg:grid-cols-[3fr_1fr_1fr] lg:items-center',
            index === 0 && 'border-t lg:border-t-0'
          )}
        >
          <div className="flex items-center gap-x-4">
            <ShoppingCartIcon className="size-5 shrink-0" />
            <h4 className="line-clamp-1">
              <Link
                href={`/dashboard/courses/${enrollment.course.id}`}
                className="text-primary hover:underline"
              >
                {enrollment.course.title}
              </Link>
            </h4>
          </div>
          <div className="grid grid-cols-[1fr_2fr] gap-x-2 lg:block">
            <span className="font-semibold lg:hidden">Date</span>
            <span>{formatDate(enrollment.createdAt)}</span>
          </div>
          <div className="grid grid-cols-[1fr_2fr] gap-x-2 lg:block">
            <span className="font-semibold lg:hidden">Amount</span>
            <span>{formatPrice(enrollment.amount / 100)}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function EnrollmentsListSkeleton({ length = 8 }: { length?: number }) {
  return (
    <ul className="text-sm lg:text-base">
      <li className="hidden grid-cols-[3fr_1fr_1fr] gap-2 border-b pb-2 font-semibold lg:grid">
        <span>Title</span>
        <span>Date</span>
        <span>Amount</span>
      </li>
      {Array.from({ length }).map((_, index) => (
        <li
          key={index}
          className={cn(
            'grid gap-2 border-b py-4 lg:grid-cols-[3fr_1fr_1fr] lg:items-center',
            index === 0 && 'border-t lg:border-t-0'
          )}
        >
          <div className="flex items-center gap-x-4">
            <ShoppingCartIcon className="size-5 shrink-0" />
            <h4 className="line-clamp-1">
              <Skeleton className="h-5 w-36 lg:h-6" />
            </h4>
          </div>
          <div className="grid grid-cols-[1fr_2fr] gap-x-2 lg:block">
            <span className="font-semibold lg:hidden">Date</span>
            <Skeleton className="h-5 w-18 lg:h-6" />
          </div>
          <div className="grid grid-cols-[1fr_2fr] gap-x-2 lg:block">
            <span className="font-semibold lg:hidden">Amount</span>
            <Skeleton className="h-5 w-18 lg:h-6" />
          </div>
        </li>
      ))}
    </ul>
  );
}
