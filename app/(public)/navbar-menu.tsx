'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { cn } from '@/app/lib/utils';
import { Session } from '@/app/lib/auth';

export default function NavbarMenu({ user }: { user: Session['user'] | null }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isMenuOpen]);

  return (
    <>
      <nav
        className={cn(
          'bg-background fixed top-20 right-0 bottom-0 left-0 flex -translate-x-full flex-col items-center justify-around gap-x-8 transition-transform md:static md:translate-x-0 md:flex-row md:transition-none',
          isMenuOpen && 'translate-x-0'
        )}
      >
        <Link href="/">Home</Link>
        <Link href="/courses">Courses</Link>
        {user && user.role === 'user' && <Link href="/dashboard">Dashboard</Link>}
        {user && user.role === 'admin' && <Link href="/admin">Admin</Link>}
      </nav>
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="relative -order-1 grid h-4 w-6 place-items-center md:hidden"
      >
        <span
          className={cn(
            'border-muted-foreground before:border-muted-foreground after:border-muted-foreground w-full border-b transition-colors before:absolute before:top-0 before:left-0 before:w-full before:border-b before:transition-transform after:absolute after:bottom-0 after:left-0 after:w-full after:border-b after:transition-transform',
            isMenuOpen &&
              'border-transparent before:top-auto before:rotate-[135deg] after:bottom-auto after:-rotate-[135deg]'
          )}
        />
      </button>
    </>
  );
}
