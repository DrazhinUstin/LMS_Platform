'use client';

import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import type { CourseFilters } from '@/app/lib/definitions';
import { cn } from '@/app/lib/utils';
import { CourseLevel, type Category } from '@/generated/prisma';
import { StarIcon } from 'lucide-react';
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
    avgRating: searchParams.get('avgRating') ?? '',
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
      avgRating: '',
      level: '',
      minPrice: '',
      maxPrice: '',
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
      <div className="space-y-2">
        <Label asChild>
          <h4>Rating</h4>
        </Label>
        <RadioGroup
          value={filters.avgRating}
          onValueChange={(val) => setFilters({ ...filters, avgRating: val })}
          className="gap-2"
        >
          <div className="flex items-center gap-x-2">
            <RadioGroupItem value="" id="unassigned" />
            <Label htmlFor="unassigned">All</Label>
          </div>
          {['4.5', '4', '3'].map((value) => (
            <div key={value} className="flex items-center gap-x-2">
              <RadioGroupItem value={value} id={value} />
              <div className="flex items-center gap-x-0.5">
                {Array.from({ length: 5 }, (_, index) => (
                  <StarIcon
                    key={index}
                    className={cn(
                      'fill-input text-input size-3.5 shrink-0',
                      index < +value && 'fill-primary text-primary'
                    )}
                  />
                ))}
              </div>
              <Label htmlFor={value}>{value} & up</Label>
            </div>
          ))}
        </RadioGroup>
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
