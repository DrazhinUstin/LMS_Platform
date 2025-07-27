'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { Session } from '@/app/lib/auth';
import LogoutButton from '@/app/components/logout-button';
import UserAvatar from '@/app/components/user-avatar';

export default function UserDropdown({ user }: { user: Session['user'] }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <UserAvatar src={user.image} width={40} height={40} className="size-10" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{user.name || user.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div>
          <LogoutButton className="w-full" />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
