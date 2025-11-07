import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Sidebar from '@/app/components/sidebar';
import { HouseIcon, LayoutGridIcon } from 'lucide-react';

const sidebarNavLinks: React.ComponentProps<typeof Sidebar>['navLinks'] = [
  { title: 'Home', icon: <HouseIcon className="size-5" />, href: '/customer' },
  { title: 'My courses', icon: <LayoutGridIcon className="size-5" />, href: '/customer/courses' },
];

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="md:grid md:grid-cols-[auto_1fr]">
      <Sidebar user={session.user} navLinks={sidebarNavLinks} />
      <div className="p-8 pl-16 md:pl-8">{children}</div>
    </div>
  );
}
