import EditCourseForm from './edit-course-form';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getCourse } from '@/app/data/course/get-course';
import { getCategories } from '@/app/data/category/get-categories';
import { getSession } from '@/app/lib/auth.get-session';

export const metadata: Metadata = {
  title: 'Edit course details',
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const [course, categories] = await Promise.all([getCourse(id, session.user.id), getCategories()]);

  if (!course) {
    notFound();
  }

  return (
    <main className="space-y-8">
      <h2 className="text-center text-2xl font-bold">Edit course</h2>
      <EditCourseForm course={course} categories={categories} />
    </main>
  );
}
