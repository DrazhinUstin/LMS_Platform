import { getSession } from '@/app/lib/auth.get-session';
import { redirect } from 'next/navigation';
import AddPhotoForm from './add-photo-form';

export default async function Page() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <main className="space-y-8">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">Photo</h2>
        <p className="text-muted-foreground">Add a nice photo of yourself for your profile</p>
      </div>
      <AddPhotoForm user={session.user} />
    </main>
  );
}
