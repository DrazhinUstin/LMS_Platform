import { prisma } from '@/app/lib/prisma';
import EnrollmentsPerDayChart from './enrollments-per-day-chart';
import { Skeleton } from '@/app/components/ui/skeleton';
import { getSession } from '@/app/lib/auth.get-session';

type ChartData = React.ComponentProps<typeof EnrollmentsPerDayChart>['chartData'];

export default async function EnrollmentsPerDay() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  const enrollments = await prisma.enrollment.findMany({
    where: {
      course: { authorId: session.user.id },
      createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    },
    orderBy: { createdAt: 'asc' },
    select: { createdAt: true },
  });

  const chartData: ChartData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    enrollments: 0,
  })).reverse();

  enrollments.forEach((enrollment) => {
    const index = chartData.findIndex(
      ({ date }) => date === enrollment.createdAt.toISOString().split('T')[0]
    );

    if (index === -1) return;

    chartData[index].enrollments = chartData[index].enrollments + 1;
  });

  return (
    <div className="space-y-4 rounded-md border p-8 shadow-md">
      <h2 className="text-2xl font-bold">Enrollments per day</h2>
      <p className="text-muted-foreground">
        Total enrollments for the last 30 days:{' '}
        <span className="text-primary font-medium">
          {chartData.reduce((acc, item) => acc + item.enrollments, 0)}
        </span>
      </p>
      <EnrollmentsPerDayChart chartData={chartData} />
    </div>
  );
}

export function EnrollmentsPerDaySkeleton() {
  return (
    <div className="space-y-4 rounded-md border p-8 shadow-md">
      <Skeleton className="h-8 w-52" />
      <Skeleton className="h-6 w-64" />
      <Skeleton className="aspect-auto h-[250px] w-full" />
    </div>
  );
}
