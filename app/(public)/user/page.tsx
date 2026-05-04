import { getSession } from '@/app/lib/auth.get-session';
import { redirect } from 'next/navigation';
import EditProfileForm from './edit-profile-form';

export default async function Page() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <main className="space-y-8">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">Public profile</h2>
        <p className="text-muted-foreground">Add information about yourself</p>
      </div>
      <EditProfileForm user={session.user} />
    </main>
  );
}
