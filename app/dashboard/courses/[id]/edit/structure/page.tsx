import { prisma } from '@/app/lib/prisma';
import { notFound } from 'next/navigation';
import EditCourseStructure from './edit-course-structure';
import CreateChapterDialog from './create-chapter-dialog';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      chapters: {
        include: { lessons: { orderBy: { position: 'asc' } } },
        orderBy: { position: 'asc' },
      },
    },
  });

  if (!course) {
    notFound();
  }

  return (
    <main className="space-y-8">
      <h2 className="text-center text-2xl font-bold">Edit course structure</h2>
      <EditCourseStructure courseId={course.id} data={course.chapters} />
      <div className="text-center">
        <CreateChapterDialog courseId={course.id} />
      </div>
    </main>
  );
}
