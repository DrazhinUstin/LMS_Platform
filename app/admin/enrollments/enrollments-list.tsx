import { cn, formatDate, formatPrice } from '@/app/lib/utils';
import Link from 'next/link';
import { Skeleton } from '@/app/components/ui/skeleton';
import UserAvatar from '@/app/components/user-avatar';
import type { EnrollmentSummary } from '@/app/lib/definitions';

export default function EnrollmentsList({ enrollments }: { enrollments: EnrollmentSummary[] }) {
  return (
    <ul className="text-sm">
      <li className="hidden grid-cols-[2fr_2fr_1fr_1fr] gap-2 border-b pb-2 font-semibold lg:grid">
        <h4>Customer</h4>
        <h4>Course</h4>
        <h4>Date</h4>
        <h4>Amount</h4>
      </li>
      {enrollments.map((enrollment, index) => (
        <li
          key={enrollment.user.id + enrollment.course.id}
          className={cn(
            'grid gap-2 border-b py-4 lg:grid-cols-[2fr_2fr_1fr_1fr] lg:items-center',
            index === 0 && 'border-t lg:border-t-0'
          )}
        >
          <div className="grid grid-cols-[1fr_2fr] gap-x-2 lg:block">
            <h4 className="font-semibold lg:hidden">Customer</h4>
            <div className="flex items-center gap-x-2">
              <UserAvatar src={enrollment.user.image} width={24} height={24} />
              <div className="space-y-1">
                <h4 className="line-clamp-1 font-medium">{enrollment.user.name}</h4>
                <p className="text-muted-foreground line-clamp-1">{enrollment.user.email}</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-[1fr_2fr] gap-x-2 lg:block">
            <h4 className="font-semibold lg:hidden">Course</h4>
            <p className="line-clamp-1">
              <Link
                href={`/courses/${enrollment.course.id}`}
                className="hover:text-primary transition-colors"
              >
                {enrollment.course.title}
              </Link>
            </p>
          </div>
          <div className="grid grid-cols-[1fr_2fr] gap-x-2 lg:block">
            <h4 className="font-semibold lg:hidden">Date</h4>
            <p>{formatDate(enrollment.createdAt)}</p>
          </div>
          <div className="grid grid-cols-[1fr_2fr] gap-x-2 lg:block">
            <h4 className="font-semibold lg:hidden">Amount</h4>
            <p>{formatPrice(enrollment.amount / 100)}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function EnrollmentsListSkeleton({ length = 8 }: { length?: number }) {
  return (
    <ul className="text-sm">
      <li className="hidden grid-cols-[2fr_2fr_1fr_1fr] gap-2 border-b pb-2 font-semibold lg:grid">
        <h4>Customer</h4>
        <h4>Course</h4>
        <h4>Date</h4>
        <h4>Amount</h4>
      </li>
      {Array.from({ length }).map((_, index) => (
        <li
          key={index}
          className={cn(
            'grid gap-2 border-b py-4 lg:grid-cols-[2fr_2fr_1fr_1fr] lg:items-center',
            index === 0 && 'border-t lg:border-t-0'
          )}
        >
          <div className="grid grid-cols-[1fr_2fr] gap-x-2 lg:block">
            <h4 className="font-semibold lg:hidden">Customer</h4>
            <div className="flex items-center gap-x-2">
              <Skeleton className="size-6 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-5 w-36" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-[1fr_2fr] gap-x-2 lg:block">
            <h4 className="font-semibold lg:hidden">Course</h4>
            <Skeleton className="h-5 w-36" />
          </div>
          <div className="grid grid-cols-[1fr_2fr] gap-x-2 lg:block">
            <h4 className="font-semibold lg:hidden">Date</h4>
            <Skeleton className="h-5 w-18" />
          </div>
          <div className="grid grid-cols-[1fr_2fr] gap-x-2 lg:block">
            <h4 className="font-semibold lg:hidden">Amount</h4>
            <Skeleton className="h-5 w-18" />
          </div>
        </li>
      ))}
    </ul>
  );
}
