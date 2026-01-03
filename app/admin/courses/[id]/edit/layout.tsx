import { getCourse } from '@/app/data/course/get-course';
import NavMenu from './nav-menu';
import { notFound, redirect } from 'next/navigation';
import { getS3ObjectUrl } from '@/app/lib/utils';
import { Button } from '@/app/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { getSession } from '@/app/lib/auth.get-session';
import { Badge } from '@/app/components/ui/badge';

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const course = await getCourse(id, session.user.id);

  if (!course) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center justify-center gap-2 text-center sm:flex-row sm:text-left">
        <div className="relative aspect-video w-32 shrink-0">
          <Image
            src={getS3ObjectUrl(course.previewImageKey)}
            alt={course.title}
            fill
            sizes="128px"
            className="rounded-sm object-cover"
          />
          {course.status === 'DRAFT' && (
            <Badge variant="secondary" className="absolute top-0.5 left-0.5">
              {course.status}
            </Badge>
          )}
        </div>
        <div className="space-y-2">
          <h4 className="font-semibold">{course.title}</h4>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/admin/courses/${course.id}`}>View course</Link>
          </Button>
        </div>
      </div>
      <NavMenu />
      {children}
    </div>
  );
}
