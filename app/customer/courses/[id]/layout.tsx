import { getCourse } from '@/app/data/course/get-course';
import { notFound } from 'next/navigation';
import CourseStructure from './course-structure';

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const course = await getCourse(id);

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
