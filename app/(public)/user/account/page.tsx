import { getSession } from '@/app/lib/auth.get-session';
import { redirect } from 'next/navigation';
import AccountForm from './account-form';

export default async function Page() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <main className="space-y-8">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">Account</h2>
        <p className="text-muted-foreground">Manage your account settings here</p>
      </div>
      <AccountForm user={session.user} />
    </main>
  );
}
