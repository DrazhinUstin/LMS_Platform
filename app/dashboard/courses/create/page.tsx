import { prisma } from '@/app/lib/prisma';
import CreateCourseForm from './create-course-form';

export default async function Page() {
  const categories = await prisma.category.findMany();
  return (
    <main className="space-y-8">
      <h2 className="text-center text-2xl font-bold">Create a new course</h2>
      <CreateCourseForm categories={categories} />
    </main>
  );
}
