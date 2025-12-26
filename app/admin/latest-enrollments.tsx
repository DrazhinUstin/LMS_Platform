import { getSession } from '@/app/lib/auth.get-session';
import { getEnrollments } from './enrollments/get-enrollments';
import UserAvatar from '@/app/components/user-avatar';
import { formatPrice } from '@/app/lib/utils';
import { Skeleton } from '@/app/components/ui/skeleton';

export default async function LatestEnrollments() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  const enrollments = await getEnrollments({
    filters: { courseAuthorId: session.user.id },
    enrollmentsPerPage,
  });

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Latest enrollments</h2>
      <ul>
        {enrollments.map((enrollment) => (
          <li
            key={enrollment.user.id + enrollment.course.id}
            className="grid grid-cols-[auto_1fr_auto] items-center gap-x-2 border-b py-4 text-sm first:border-t lg:text-base"
          >
            <UserAvatar src={enrollment.user.image} width={24} height={24} />
            <div className="space-y-1">
              <h4 className="font-medium">{enrollment.user.name}</h4>
              <span className="text-muted-foreground">{enrollment.user.email}</span>
            </div>
            <span>{formatPrice(enrollment.amount / 100)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function LatestEnrollmentsSkeleton() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Latest enrollments</h2>
      <ul>
        {Array.from({ length: enrollmentsPerPage }, (_, i) => (
          <li
            key={i}
            className="grid grid-cols-[auto_1fr_auto] items-center gap-x-2 border-b py-4 text-sm first:border-t lg:text-base"
          >
            <Skeleton className="size-6 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-5 w-32 lg:h-6" />
              <Skeleton className="h-5 w-36 lg:h-6" />
            </div>
            <Skeleton className="h-5 w-18 lg:h-6" />
          </li>
        ))}
      </ul>
    </div>
  );
}

const enrollmentsPerPage = 5;
