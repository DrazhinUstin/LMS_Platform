import LoginForm from './login-form';
import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect('/');
  }

  return (
    <main className="grid h-screen place-items-center">
      <LoginForm />
    </main>
  );
}
