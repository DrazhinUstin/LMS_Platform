import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Sidebar from './sidebar';

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
      <Sidebar user={session.user} />
      <div className="p-8 pl-16 md:pl-8">{children}</div>
    </div>
  );
}
