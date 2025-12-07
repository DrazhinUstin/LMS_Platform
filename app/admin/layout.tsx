import { notFound, redirect } from 'next/navigation';
import Sidebar from '@/app/components/sidebar';
import { CircleDollarSign, HouseIcon, LayoutGridIcon, SquarePenIcon } from 'lucide-react';
import type { Metadata } from 'next';
import { getSession } from '@/app/lib/auth.get-session';

export const metadata: Metadata = {
  title: {
    template: '%s | Admin',
    default: 'Admin',
    absolute: 'Admin',
  },
};

const sidebarNavLinks: React.ComponentProps<typeof Sidebar>['navLinks'] = [
  { title: 'Home', icon: <HouseIcon className="size-5" />, href: '/admin' },
  { title: 'Courses', icon: <LayoutGridIcon className="size-5" />, href: '/admin/courses' },
  {
    title: 'Quick create',
    icon: <SquarePenIcon className="size-5" />,
    href: '/admin/courses/create',
  },
  {
    title: 'Enrollments',
    icon: <CircleDollarSign className="size-5" />,
    href: '/admin/enrollments',
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

  if (session.user.role !== 'admin') {
    notFound();
  }

  return (
    <div className="md:grid md:grid-cols-[auto_1fr]">
      <Sidebar user={session.user} navLinks={sidebarNavLinks} />
      <div className="p-8 pl-16 md:pl-8">{children}</div>
    </div>
  );
}
