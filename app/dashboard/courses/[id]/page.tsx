import { getUserCourse } from '@/app/data/course/get-user-course';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getSession } from '@/app/lib/auth.get-session';
import CourseDetail from './course-detail';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const course = await getUserCourse({ courseId: id, userId: session.user.id });

  if (!course) notFound();

  return {
    title: {
      absolute: `Course: ${course.title}`,
    },
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;

  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const course = await getUserCourse({ courseId: id, userId: session.user.id });

  if (!course) notFound();

  return (
    <main>
      <CourseDetail course={course} />
    </main>
  );
}
