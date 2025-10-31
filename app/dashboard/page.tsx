import { Suspense } from 'react';
import Totals, { TotalsSkeleton } from './totals';

export default function Page() {
  return (
    <main>
      <Suspense fallback={<TotalsSkeleton />}>
        <Totals />
      </Suspense>
    </main>
  );
}
