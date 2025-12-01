import LoginForm from './login-form';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getSession } from '@/app/lib/auth.get-session';

export const metadata: Metadata = {
  title: 'Login',
};

export default async function Page() {
  const session = await getSession();

  if (session) {
    redirect('/');
  }

  return (
    <main className="grid h-screen place-items-center">
      <LoginForm />
    </main>
  );
}
