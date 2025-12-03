'use client';

import { ChevronRightIcon } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { useState } from 'react';
import { cn } from '@/app/lib/utils';
import Link from 'next/link';
import ThemeSwitch from '@/app/components/theme-switch';
import { Session } from '@/app/lib/auth';
import UserDropdown from '@/app/components/user-dropdown';
import { usePathname } from 'next/navigation';

export default function Sidebar({
  user,
  navLinks,
}: {
  user: Session['user'];
  navLinks: { title: string; icon: React.ReactNode; href: string }[];
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  return (
    <aside
      className={cn(
        'bg-background fixed top-0 z-50 grid h-screen w-60 grid-rows-[auto_1fr_auto] gap-y-8 border-r transition-[margin] md:sticky',
        !isSidebarOpen && '-ml-52'
      )}
    >
      <header className="grid grid-cols-[1fr_auto]">
        <h2 className="pt-4 pl-4 text-xl">
          <Link href="/">LMS Platform</Link>
        </h2>
        <Button
          variant="secondary"
          size="icon"
          className="size-8 rounded-none"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <ChevronRightIcon
            className={cn('size-5 transition-transform', isSidebarOpen && 'rotate-180')}
          />
        </Button>
      </header>
      <div>
        <nav className="flex flex-col gap-y-8">
          {navLinks.map(({ title, icon, href }) => (
            <Link
              key={title}
              href={href}
              className={cn(
                'hover:bg-primary hover:text-primary-foreground grid grid-cols-[1fr_auto] items-center gap-x-4 pl-4 transition-colors',
                href === pathname && 'bg-primary text-primary-foreground'
              )}
              onClick={() => window.innerWidth < 768 && setIsSidebarOpen(false)}
            >
              {title}
              <span className="grid size-8 place-items-center">{icon}</span>
            </Link>
          ))}
        </nav>
      </div>
      <footer className="flex items-center justify-center gap-x-4 pb-4 pl-4">
        <UserDropdown user={user} />
        <ThemeSwitch />
      </footer>
    </aside>
  );
}
