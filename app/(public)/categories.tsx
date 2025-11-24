import { getCategories } from '@/app/data/category/get-categories';
import { Button } from '@/app/components/ui/button';
import Link from 'next/link';
import { Skeleton } from '@/app/components/ui/skeleton';
import CategoryIcon from '@/app/components/category-icon';

export default async function Categories() {
  const categories = await getCategories();
  return (
    <div className="space-y-8">
      <h2 className="text-center text-2xl font-bold">Available categories</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((category) => (
          <Button key={category.id} variant="outline" size="lg" asChild>
            <Link href={`/courses?categoryName=${encodeURIComponent(category.name)}`}>
              <CategoryIcon categoryName={category.name} />
              {category.name}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
}

export function CategoriesSkeleton() {
  return (
    <div className="space-y-8">
      <h2 className="text-center text-2xl font-bold">Available categories</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <Skeleton key={index} className="h-10" />
        ))}
      </div>
    </div>
  );
}
