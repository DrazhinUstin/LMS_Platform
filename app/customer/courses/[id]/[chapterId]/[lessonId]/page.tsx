import { notFound, redirect } from 'next/navigation';
import LessonDetails from './lesson-details';
import CompletionButton from './completion-button';
import { getUserLesson } from '@/app/data/lesson/get-user-lesson';
import type { Metadata } from 'next';
import { getSession } from '@/app/lib/auth.get-session';

interface Props {
  params: Promise<{ lessonId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lessonId } = await params;

  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const lessonWithProgresses = await getUserLesson({ lessonId, userId: session.user.id });

  if (!lessonWithProgresses) notFound();

  return {
    title: {
      absolute: `Lesson: ${lessonWithProgresses.title}`,
    },
  };
}

export default async function Page({ params }: Props) {
  const { lessonId } = await params;

  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const lessonWithProgresses = await getUserLesson({ lessonId, userId: session.user.id });

  if (!lessonWithProgresses) notFound();

  const { userProgresses, ...lesson } = lessonWithProgresses;

  return (
    <main className="space-y-8">
      <LessonDetails lesson={lesson} />
      <CompletionButton
        lessonId={lesson.id}
        isLessonCompleted={userProgresses[0]?.isCompleted ?? false}
      />
    </main>
  );
}
