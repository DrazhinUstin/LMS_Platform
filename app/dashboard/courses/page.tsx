import { prisma } from '@/app/lib/prisma';
import CourseCard from './course-card';

export default async function Page() {
  const courses = await prisma.course.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return (
    <main className="space-y-8">
      <h2 className="text-center text-2xl font-semibold">Your courses</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </main>
  );
}
