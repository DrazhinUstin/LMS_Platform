import { notFound, redirect } from 'next/navigation';
import CourseStructure from '@/app/dashboard/courses/[id]/course-structure';
import CourseProgress from '@/app/dashboard/courses/[id]/course-progress';
import { getSession } from '@/app/lib/auth.get-session';
import { getUserCourse } from '@/app/data/course/get-user-course';
import { Button } from '@/app/components/ui/button';
import Link from 'next/link';
import { SquarePenIcon } from 'lucide-react';

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const course = await getUserCourse({ courseId: id, userId: session.user.id, isAuthor: true });

  if (!course) notFound();

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:items-start">
      <div>{children}</div>
      <aside className="space-y-4 lg:sticky lg:top-8">
        <CourseProgress course={course} coursePath={`/admin/courses/${course.id}`} />
        <CourseStructure course={course} coursePath={`/admin/courses/${course.id}`} />
        <Button variant="secondary" className="w-full" asChild>
          <Link href={`/admin/courses/${course.id}/edit/structure`}>
            <SquarePenIcon /> Edit structure
          </Link>
        </Button>
      </aside>
    </div>
  );
}
