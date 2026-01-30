'use client';

import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import type { ArticleFilters } from '@/app/lib/definitions';
import type { Category } from '@/generated/prisma';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

type FiltersType = Record<Exclude<keyof ArticleFilters, 'authorId' | 'status'>, string>;

export default function Filters({ categories }: { categories: Category[] }) {
  const router = useRouter();

  const pathname = usePathname();

  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<FiltersType>({
    query: searchParams.get('query') ?? '',
    categoryName: searchParams.get('categoryName') ?? '',
  });

  const areFiltersApplied = Object.entries(filters).every(([key, value]) => {
    if ((!value || value === 'unassigned') && !searchParams.has(key)) {
      return true;
    }
    return value === searchParams.get(key);
  });

  const applyFilters = (filtersToApply: FiltersType) => {
    const newSearchParams = new URLSearchParams(searchParams);

    if (newSearchParams.has('page')) newSearchParams.set('page', '1');

    Object.entries(filtersToApply).forEach(([key, value]) => {
      if (!value || value === 'unassigned') {
        newSearchParams.delete(key);
      } else {
        newSearchParams.set(key, value);
      }

      router.replace(`${pathname}?${newSearchParams.toString()}`);
    });
  };

  const resetFilters = () => {
    const clearedFilters: FiltersType = {
      query: '',
      categoryName: '',
    };

    setFilters(clearedFilters);

    applyFilters(clearedFilters);
  };

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        applyFilters(filters);
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="query">Search query</Label>
        <Input
          id="query"
          placeholder="Search..."
          value={filters.query}
          onChange={(e) => setFilters({ ...filters, query: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="categoryName">Category</Label>
        <Select
          value={filters.categoryName}
          onValueChange={(val) => setFilters({ ...filters, categoryName: val })}
        >
          <SelectTrigger id="categoryName" className="w-full">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unassigned">All</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.name}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="text-center">
        <Button type="submit" className="w-full" disabled={areFiltersApplied}>
          Apply filters
        </Button>
        {Object.keys(filters).some((key) => searchParams.has(key)) && (
          <Button type="button" variant="ghost" size="sm" className="mt-2" onClick={resetFilters}>
            Reset filters
          </Button>
        )}
      </div>
    </form>
  );
}
