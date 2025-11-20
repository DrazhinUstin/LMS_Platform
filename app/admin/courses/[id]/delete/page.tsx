import { prisma } from '@/app/lib/prisma';
import { notFound } from 'next/navigation';
import DeleteCourseForm from './delete-course-form';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const course = await prisma.course.findUnique({ where: { id } });

  if (!course) {
    notFound();
  }

  return (
    <main className="space-y-8">
      <h2 className="text-center text-2xl font-bold">Course deletion</h2>
      <DeleteCourseForm course={course} />
    </main>
  );
}
