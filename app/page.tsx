import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import LogoutButton from '@/app/components/logout-button';

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/login');
  }

  return (
    <main>
      <h2>Hello, {session.user.name}!</h2>
      <LogoutButton />
    </main>
  );
}
