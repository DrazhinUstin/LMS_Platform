import { Suspense } from 'react';
import Totals, { TotalsSkeleton } from './totals';
import EnrollmentsPerDay, { EnrollmentsPerDaySkeleton } from './enrollments-per-day';

export default function Page() {
  return (
    <main className="space-y-8">
      <Suspense fallback={<TotalsSkeleton />}>
        <Totals />
      </Suspense>
      <Suspense fallback={<EnrollmentsPerDaySkeleton />}>
        <EnrollmentsPerDay />
      </Suspense>
    </main>
  );
}
