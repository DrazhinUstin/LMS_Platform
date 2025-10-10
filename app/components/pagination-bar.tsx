'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { cn, generatePagination } from '@/app/lib/utils';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/app/components/ui/pagination';

export default function PaginationBar({
  currentPage,
  totalPages,
  className,
}: {
  currentPage: number;
  totalPages: number;
  className?: string;
}) {
  const pathname = usePathname();

  const searchParams = useSearchParams();

  if (totalPages <= 1) {
    return null;
  }

  const createPageHref = (page: number) => {
    const newSearchParams = new URLSearchParams(searchParams);

    newSearchParams.set('page', page.toString());

    return `${pathname}?${newSearchParams.toString()}`;
  };

  const pages = generatePagination(currentPage, totalPages);

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={createPageHref(currentPage - 1)}
            className={cn(currentPage <= 1 && 'text-muted-foreground pointer-events-none')}
            tabIndex={currentPage <= 1 ? -1 : undefined}
            aria-disabled={currentPage <= 1}
          />
        </PaginationItem>
        {pages.map((page, index) => (
          <PaginationItem key={page + '-' + index}>
            {typeof page === 'number' ? (
              <PaginationLink href={createPageHref(page)} isActive={page === currentPage}>
                {page}
              </PaginationLink>
            ) : (
              <PaginationEllipsis />
            )}
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            href={createPageHref(currentPage + 1)}
            className={cn(currentPage >= totalPages && 'text-muted-foreground pointer-events-none')}
            tabIndex={currentPage >= totalPages ? -1 : undefined}
            aria-disabled={currentPage >= totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
