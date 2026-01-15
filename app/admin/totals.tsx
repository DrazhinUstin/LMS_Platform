import { prisma } from '@/app/lib/prisma';
import { LibraryBigIcon, NotebookPenIcon, UserRoundCheck, UsersRoundIcon } from 'lucide-react';
import { Skeleton } from '@/app/components/ui/skeleton';
import { getSession } from '@/app/lib/auth.get-session';

export default async function Totals() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  const [totalUsers, totalCustomers, totalCourses, totalLessons] = await Promise.all([
    prisma.user.count({ where: { id: { not: session.user.id } } }),
    prisma.user.count({
      where: { enrollments: { some: { status: 'ACTIVE', course: { authorId: session.user.id } } } },
    }),
    prisma.course.count({ where: { authorId: session.user.id } }),
    prisma.lesson.count({ where: { chapter: { course: { authorId: session.user.id } } } }),
  ]);

  return (
    <div className="grid grid-cols-[repeat(auto-fit,_minmax(280px,_1fr))] gap-8">
      <div className="bg-card text-card-foreground space-y-4 rounded-lg border p-8 shadow-md">
        <h4 className="font-medium">Total signups</h4>
        <div className="flex items-center gap-x-4">
          <span className="bg-primary/10 grid size-10 place-items-center rounded-full">
            <UsersRoundIcon className="text-primary size-6" />
          </span>
          <h2 className="text-4xl font-bold">{totalUsers}</h2>
        </div>
        <p className="text-muted-foreground text-sm">Total number of registered users</p>
      </div>
      <div className="bg-card text-card-foreground space-y-4 rounded-lg border p-8 shadow-md">
        <h4 className="font-medium">Total customers</h4>
        <div className="flex items-center gap-x-4">
          <span className="bg-primary/10 grid size-10 place-items-center rounded-full">
            <UserRoundCheck className="text-primary size-6" />
          </span>
          <h2 className="text-4xl font-bold">{totalCustomers}</h2>
        </div>
        <p className="text-muted-foreground text-sm">Total number of enrolled users</p>
      </div>
      <div className="bg-card text-card-foreground space-y-4 rounded-lg border p-8 shadow-md">
        <h4 className="font-medium">Total courses</h4>
        <div className="flex items-center gap-x-4">
          <span className="bg-primary/10 grid size-10 place-items-center rounded-full">
            <LibraryBigIcon className="text-primary size-6" />
          </span>
          <h2 className="text-4xl font-bold">{totalCourses}</h2>
        </div>
        <p className="text-muted-foreground text-sm">Total number of available courses</p>
      </div>
      <div className="bg-card text-card-foreground space-y-4 rounded-lg border p-8 shadow-md">
        <h4 className="font-medium">Total lessons</h4>
        <div className="flex items-center gap-x-4">
          <span className="bg-primary/10 grid size-10 place-items-center rounded-full">
            <NotebookPenIcon className="text-primary size-6" />
          </span>
          <h2 className="text-4xl font-bold">{totalLessons}</h2>
        </div>
        <p className="text-muted-foreground text-sm">Total number of available lessons</p>
      </div>
    </div>
  );
}

export function TotalsSkeleton() {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,_minmax(280px,_1fr))] gap-8">
      {Array.from({ length: 4 }, (_, i) => i).map((item) => (
        <div
          key={item}
          className="bg-card text-card-foreground space-y-4 rounded-lg border p-8 shadow-md"
        >
          <Skeleton className="h-6 w-1/2" />
          <div className="flex items-center gap-x-4">
            <Skeleton className="size-10 rounded-full" />
            <Skeleton className="h-10 w-16" />
          </div>
          <Skeleton className="h-5 w-4/5" />
        </div>
      ))}
    </div>
  );
}
