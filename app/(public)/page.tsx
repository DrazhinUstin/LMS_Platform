import { Suspense } from 'react';
import Categories, { CategoriesSkeleton } from './categories';
import Hero from './hero';

export default async function Page() {
  return (
    <main className="mx-auto w-[90vw] max-w-7xl space-y-8 py-8">
      <Hero />
      <Suspense fallback={<CategoriesSkeleton />}>
        <Categories />
      </Suspense>
    </main>
  );
}
