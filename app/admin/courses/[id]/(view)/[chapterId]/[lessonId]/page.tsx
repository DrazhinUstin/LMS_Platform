import { notFound, redirect } from 'next/navigation';
import LessonDetails from '@/app/dashboard/courses/[id]/[chapterId]/[lessonId]/lesson-details';
import { getSession } from '@/app/lib/auth.get-session';
import type { Metadata } from 'next';
import { Button } from '@/app/components/ui/button';
import Link from 'next/link';
import { getUserLesson } from '@/app/data/lesson/get-user-lesson';

export const metadata: Metadata = {
  title: 'Lesson preview',
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; lessonId: string }>;
}) {
  const { id: courseId, lessonId } = await params;

  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const lesson = await getUserLesson({ lessonId, userId: session.user.id, isAuthor: true });

  if (!lesson) notFound();

  return (
    <main className="space-y-8">
      <LessonDetails lesson={lesson} />
      <hr />
      <Button className="w-full" asChild>
        <Link href={`/admin/courses/${courseId}/edit/structure/${lesson.chapterId}/${lesson.id}`}>
          Edit lesson
        </Link>
      </Button>
    </main>
  );
}
