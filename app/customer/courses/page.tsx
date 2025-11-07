import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/app/lib/prisma';
import CourseCard from '@/app/(public)/courses/course-card';

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/login');
  }

  const enrolledCourses = (
    await prisma.enrollment.findMany({
      where: { userId: session.user.id, status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' },
      select: { course: true },
    })
  ).map(({ course }) => course);

  return (
    <main className="space-y-8">
      <h2 className="text-center text-2xl font-semibold">Courses you are enrolled in</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {enrolledCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </main>
  );
}
