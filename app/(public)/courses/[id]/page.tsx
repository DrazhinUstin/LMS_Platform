import { getCourse } from '@/app/data/course/get-course';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CourseDetail from './course-detail';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).id;

  const course = await getCourse(id);

  if (!course) notFound();

  return {
    title: course.title,
    description: course.briefDescription,
  };
}

export default async function Page({ params }: Props) {
  const id = (await params).id;

  const course = await getCourse(id);

  if (!course) notFound();

  return (
    <main className="mx-auto w-[90vw] max-w-7xl space-y-8 py-8">
      <CourseDetail course={course} />
    </main>
  );
}
