'use client';

import { cn } from '@/app/lib/utils';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

function getLinks(courseId: string): Array<{ label: string; href: string }> {
  return [
    { label: 'Edit details', href: `/dashboard/courses/${courseId}/edit` },
    { label: 'Edit structure', href: `/dashboard/courses/${courseId}/edit/structure` },
  ];
}

export default function NavMenu() {
  const { id } = useParams<{ id: string }>();
  const pathname = usePathname();
  return (
    <nav className="bg-muted mx-auto w-max rounded-sm p-1 shadow-2xs">
      {getLinks(id).map(({ label, href }) => (
        <Link
          key={label}
          href={href}
          className={cn(
            'inline-block rounded-sm px-2 py-1',
            href === pathname && 'bg-background dark:bg-input shadow-2xs'
          )}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
