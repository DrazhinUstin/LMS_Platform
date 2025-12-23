import { notFound } from 'next/navigation';
import EditCourseStructure from './edit-course-structure';
import CreateChapterDialog from './create-chapter-dialog';
import type { Metadata } from 'next';
import { getCourse } from '@/app/data/course/get-course';

export const metadata: Metadata = {
  title: 'Edit course structure',
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const course = await getCourse(id);

  if (!course) {
    notFound();
  }

  return (
    <main className="space-y-8">
      <h2 className="text-center text-2xl font-bold">Edit course structure</h2>
      <EditCourseStructure courseId={course.id} data={course.chapters} />
      <div className="text-center">
        <CreateChapterDialog courseId={course.id} />
      </div>
    </main>
  );
}
