import { prisma } from '@/app/lib/prisma';
import { notFound } from 'next/navigation';
import EditCourseStructure from './edit-course-structure';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const course = await prisma.course.findUnique({
    where: { id },
    include: { chapters: { include: { lessons: true } } },
  });

  if (!course) {
    notFound();
  }

  return (
    <main className="space-y-8">
      <h2 className="text-center text-2xl font-bold">Edit course structure</h2>
      <EditCourseStructure data={course.chapters} />
    </main>
  );
}
