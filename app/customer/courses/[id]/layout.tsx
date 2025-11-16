import { notFound, redirect } from 'next/navigation';
import CourseStructure from './course-structure';
import { getUserCourse } from '@/app/data/course/get-user-course';
import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';

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
      <aside className="lg:sticky lg:top-8">
        <CourseStructure course={course} />
      </aside>
    </div>
  );
}
