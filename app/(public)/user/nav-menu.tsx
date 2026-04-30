'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/app/lib/utils';

export default function NavMenu({ navLinks }: { navLinks: { title: string; href: string }[] }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col">
      {navLinks.map(({ title, href }) => (
        <Link
          key={title}
          href={href}
          className={cn(
            'hover:bg-primary hover:text-primary-foreground text-muted-foreground px-2 py-1 transition-colors',
            href === pathname && 'bg-primary text-primary-foreground'
          )}
        >
          {title}
        </Link>
      ))}
    </nav>
  );
}
