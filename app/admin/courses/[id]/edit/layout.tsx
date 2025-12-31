import { getCourse } from '@/app/data/course/get-course';
import NavMenu from './nav-menu';
import { notFound } from 'next/navigation';
import { getS3ObjectUrl } from '@/app/lib/utils';
import { Button } from '@/app/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const course = await getCourse(id);

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
