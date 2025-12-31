import EditCourseForm from './edit-course-form';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCourse } from '@/app/data/course/get-course';
import { getCategories } from '@/app/data/category/get-categories';

export const metadata: Metadata = {
  title: 'Edit course details',
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [course, categories] = await Promise.all([getCourse(id), getCategories()]);

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
