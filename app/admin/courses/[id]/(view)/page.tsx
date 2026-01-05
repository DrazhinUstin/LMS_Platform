import { notFound, redirect } from 'next/navigation';
import { getSession } from '@/app/lib/auth.get-session';
import CourseDetail from '@/app/dashboard/courses/[id]/course-detail';
import type { Metadata } from 'next';
import { Button } from '@/app/components/ui/button';
import Link from 'next/link';
import { getUserCourse } from '@/app/data/course/get-user-course';

export const metadata: Metadata = {
  title: 'Course preview',
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const course = await getUserCourse({ courseId: id, userId: session.user.id, isAuthor: true });

  if (!course) notFound();

  return (
    <main className="space-y-8">
      <CourseDetail course={course} />
      <hr />
      <Button className="w-full" asChild>
        <Link href={`/admin/courses/${course.id}/edit`}>Edit course</Link>
      </Button>
    </main>
  );
}
