import { redirect } from 'next/navigation';
import Sidebar from '@/app/components/sidebar';
import { HistoryIcon, HouseIcon, LayoutGridIcon, SquarePenIcon } from 'lucide-react';
import type { Metadata } from 'next';
import { getSession } from '@/app/lib/auth.get-session';

export const metadata: Metadata = {
  title: {
    template: '%s | Dashboard',
    default: 'Dashboard',
    absolute: 'Dashboard',
  },
};

const sidebarNavLinks: React.ComponentProps<typeof Sidebar>['navLinks'] = [
  { title: 'Home', icon: <HouseIcon className="size-5" />, href: '/dashboard' },
  { title: 'My courses', icon: <LayoutGridIcon className="size-5" />, href: '/dashboard/courses' },
  { title: 'My reviews', icon: <SquarePenIcon className="size-5" />, href: '/dashboard/reviews' },
  {
    title: 'Enrollments',
    icon: <HistoryIcon className="size-5" />,
    href: '/dashboard/enrollments',
  },
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
    <div className="md:grid md:grid-cols-[auto_1fr]">
      <Sidebar user={session.user} navLinks={sidebarNavLinks} />
      <div className="p-8 pl-16 md:pl-8">{children}</div>
    </div>
  );
}
