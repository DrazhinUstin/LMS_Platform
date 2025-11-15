import { notFound, redirect } from 'next/navigation';
import LessonDetails from './lesson-details';
import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';
import { prisma } from '@/app/lib/prisma';
import CompletionButton from './completion-button';

export default async function Page({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/login');
  }

  const lessonWithProgresses = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      userProgresses: { where: { userId: session.user.id }, select: { isCompleted: true } },
    },
  });

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
