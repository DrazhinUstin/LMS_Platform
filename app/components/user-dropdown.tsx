'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { Session } from '@/app/lib/auth';
import LogoutButton from '@/app/components/logout-button';
import UserAvatar from '@/app/components/user-avatar';
import Link from 'next/link';

export default function UserDropdown({ user }: { user: Session['user'] }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <UserAvatar src={user.image} width={40} height={40} className="size-10" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          <h4>{user.name || user.email}</h4>
          {user.name && <span className="text-muted-foreground font-normal">{user.email}</span>}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {user.role === 'user' && (
          <DropdownMenuItem asChild>
            <Link href="/dashboard">Dashboard</Link>
          </DropdownMenuItem>
        )}
        {user.role === 'admin' && (
          <DropdownMenuItem asChild>
            <Link href="/admin">Admin</Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <div>
          <LogoutButton className="w-full" />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
