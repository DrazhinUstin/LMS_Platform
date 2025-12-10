import { Suspense } from 'react';
import Categories, { CategoriesSkeleton } from './categories';
import Hero from './hero';
import Featured from './featured';
import MotivationCards from './motivation-cards';
import FAQ from './faq';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { featured_order } = await searchParams;
  return (
    <main className="mx-auto w-[90vw] max-w-7xl space-y-8 py-8">
      <Hero />
      <MotivationCards />
      <Suspense fallback={<CategoriesSkeleton />}>
        <Categories />
      </Suspense>
      <Featured order={featured_order as React.ComponentProps<typeof Featured>['order']} />
      <FAQ />
    </main>
  );
}
