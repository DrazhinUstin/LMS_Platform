import { redirect } from 'next/navigation';
import { getSession } from '@/app/lib/auth.get-session';
import UserAvatar from '@/app/components/user-avatar';
import NavMenu from './nav-menu';

const navLinks: React.ComponentProps<typeof NavMenu>['navLinks'] = [
  { title: 'Profile', href: '/user' },
  { title: 'Photo', href: '/user/photo' },
  { title: 'Account', href: '/user/account' },
];

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="mx-auto grid w-[90vw] max-w-7xl gap-8 py-8 md:grid-cols-[auto_1fr]">
      <aside className="space-y-4 md:w-60">
        <header className="space-y-2">
          <UserAvatar
            src={session.user.image}
            width={100}
            height={100}
            className="mx-auto size-25"
          />
          <h4 className="text-center font-medium">{session.user.name}</h4>
        </header>
        <NavMenu navLinks={navLinks} />
      </aside>
      <div>{children}</div>
    </div>
  );
}
