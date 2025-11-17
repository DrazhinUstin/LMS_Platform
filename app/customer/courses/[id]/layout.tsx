import { notFound, redirect } from 'next/navigation';
import CourseStructure from './course-structure';
import { getUserCourse } from '@/app/data/course/get-user-course';
import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';
import CourseProgress from './course-progress';

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/login');
  }

  const course = await getUserCourse({ courseId: id, userId: session.user.id });

  if (!course) notFound();

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:items-start">
      <div>{children}</div>
      <aside className="space-y-4 lg:sticky lg:top-8">
        <CourseProgress course={course} />
        <CourseStructure course={course} />
      </aside>
    </div>
  );
}
