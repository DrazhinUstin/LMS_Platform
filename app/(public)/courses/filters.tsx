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
import type { CourseFilters } from '@/app/lib/definitions';
import { CourseLevel, type Category } from '@/generated/prisma';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

type FiltersType = Record<Exclude<keyof CourseFilters, 'authorId' | 'notEnrolledByUserId'>, string>;

export default function Filters({ categories }: { categories: Category[] }) {
  const router = useRouter();

  const pathname = usePathname();

  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<FiltersType>({
    query: searchParams.get('query') ?? '',
    categoryName: searchParams.get('categoryName') ?? '',
    level: searchParams.get('level') ?? '',
    minPrice: searchParams.get('minPrice') ?? '',
    maxPrice: searchParams.get('maxPrice') ?? '',
  });

  const areFiltersApplied = Object.entries(filters).every(([key, value]) => {
    if ((!value || value === 'unassigned') && !searchParams.has(key)) {
      return true;
    }
    return value === searchParams.get(key);
  });

  const applyFilters = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newSearchParams = new URLSearchParams(searchParams);

    newSearchParams.set('page', '1');

    Object.entries(filters).forEach(([key, value]) => {
      if (!value || value === 'unassigned') {
        newSearchParams.delete(key);
      } else {
        newSearchParams.set(key, value);
      }

      router.push(`${pathname}?${newSearchParams.toString()}`);
    });
  };

  return (
    <form className="space-y-8" onSubmit={applyFilters}>
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
      <div className="space-y-2">
        <Label htmlFor="level">Level</Label>
        <Select
          value={filters.level}
          onValueChange={(val) => setFilters({ ...filters, level: val })}
        >
          <SelectTrigger id="level" className="w-full">
            <SelectValue placeholder="Select level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unassigned">All</SelectItem>
            {Object.entries(CourseLevel).map(([key, value]) => (
              <SelectItem key={key} value={value}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="price">Price ($)</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            id="price"
            placeholder="From"
            step="0.01"
            min="0"
            value={filters.minPrice}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
          />
          <span>-</span>
          <Input
            type="number"
            placeholder="To"
            step="0.01"
            min="0"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
          />
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={areFiltersApplied}>
        Apply filters
      </Button>
    </form>
  );
}
