'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/app/lib/utils';
import { Session } from '@/app/lib/auth';

export default function NavbarMenu({ user }: { user: Session['user'] | null }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const links = [...(menuRef.current?.children ?? [])];

    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';

      links.forEach(
        (link, index) =>
          ((link as HTMLElement).style.animation =
            `1s ease ${0.15 + index / links.length}s forwards appearance`)
      );
    } else {
      document.body.style.overflow = '';

      links.forEach((link) => ((link as HTMLElement).style.animation = ''));
    }
  }, [isMenuOpen]);

  return (
    <>
      <nav
        className={cn(
          'bg-background fixed top-20 right-0 bottom-0 left-0 flex -translate-x-full flex-col items-center justify-around gap-x-8 transition-transform md:static md:translate-x-0 md:flex-row md:transition-none',
          isMenuOpen && 'translate-x-0'
        )}
        ref={menuRef}
      >
        <Link
          href="/courses"
          className="hover:text-primary opacity-0 transition-colors md:opacity-100"
        >
          Courses
        </Link>
        <Link
          href="/articles"
          className="hover:text-primary opacity-0 transition-colors md:opacity-100"
        >
          Articles
        </Link>
        {user && user.role === 'user' && (
          <Link
            href="/dashboard"
            className="hover:text-primary opacity-0 transition-colors md:opacity-100"
          >
            Dashboard
          </Link>
        )}
        {user && user.role === 'admin' && (
          <Link
            href="/admin"
            className="hover:text-primary opacity-0 transition-colors md:opacity-100"
          >
            Admin
          </Link>
        )}
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
