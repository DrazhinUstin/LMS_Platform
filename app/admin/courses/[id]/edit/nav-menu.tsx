'use client';

import { cn } from '@/app/lib/utils';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

function getLinks(courseId: string): Array<{ label: string; href: string }> {
  return [
    { label: 'Edit details', href: `/admin/courses/${courseId}/edit` },
    { label: 'Edit structure', href: `/admin/courses/${courseId}/edit/structure` },
  ];
}

export default function NavMenu() {
  const { id } = useParams<{ id: string }>();

  const pathname = usePathname();

  return (
    <nav className="bg-card text-card-foreground mx-auto w-max rounded-lg shadow-md">
      {getLinks(id).map(({ label, href }) => (
        <Link
          key={label}
          href={href}
          className={cn(
            'inline-flex min-w-28 justify-center rounded-lg p-1.5 text-sm',
            href === pathname &&
              'bg-primary text-primary-foreground dark:bg-input dark:text-foreground'
          )}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
