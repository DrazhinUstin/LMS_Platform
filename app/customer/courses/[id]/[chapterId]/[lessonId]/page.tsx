import { getLesson } from '@/app/data/lesson/get-lesson';
import { notFound } from 'next/navigation';
import LessonDetails from './lesson-details';

export default async function Page({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;

  const lesson = await getLesson(lessonId);

  if (!lesson) notFound();

  return (
    <main className="space-y-8">
      <LessonDetails lesson={lesson} />
    </main>
  );
}
