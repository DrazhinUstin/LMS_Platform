import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';
import Link from 'next/link';
import ThemeSwitch from '@/app/components/theme-switch';
import { Button } from '@/app/components/ui/button';
import { UserRoundPlusIcon } from 'lucide-react';
import UserDropdown from '@/app/components/user-dropdown';
import NavbarMenu from './navbar-menu';

export default async function Navbar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <header className="bg-background sticky top-0 z-50 h-20 border-b shadow-md">
      <div className="mx-auto flex h-full w-[90vw] max-w-7xl items-center justify-between gap-x-4">
        <h2 className="text-xl font-semibold">LMS Platform</h2>
        <NavbarMenu user={session?.user ?? null} />
        <div className="flex items-center gap-x-4">
          <ThemeSwitch />
          {session?.user ? (
            <UserDropdown user={session.user} />
          ) : (
            <Button asChild>
              <Link href="/login">
                <UserRoundPlusIcon />
                Login
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
