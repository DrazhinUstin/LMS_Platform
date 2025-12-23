import { notFound } from 'next/navigation';
import EditLessonForm from './edit-lesson-form';
import type { Metadata } from 'next';
import { getLesson } from '@/app/data/lesson/get-lesson';

export const metadata: Metadata = {
  title: 'Edit lesson',
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; chapterId: string; lessonId: string }>;
}) {
  const { lessonId } = await params;

  const lesson = await getLesson(lessonId);

  if (!lesson) {
    notFound();
  }

  return (
    <main className="space-y-8">
      <h2 className="text-center text-2xl font-bold">Edit lesson</h2>
      <EditLessonForm lesson={lesson} />
    </main>
  );
}
