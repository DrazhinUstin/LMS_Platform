import { notFound, redirect } from 'next/navigation';
import DeleteCourseForm from './delete-course-form';
import type { Metadata } from 'next';
import { getSession } from '@/app/lib/auth.get-session';
import { getCourse } from '@/app/data/course/get-course';

export const metadata: Metadata = {
  title: 'Delete course',
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const course = await getCourse(id, session.user.id);

  if (!course) {
    notFound();
  }

  return (
    <main className="space-y-8">
      <h2 className="text-center text-2xl font-bold">Course deletion</h2>
      <DeleteCourseForm course={course} />
    </main>
  );
}
