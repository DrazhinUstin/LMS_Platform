import { getUserCourse } from '@/app/data/course/get-user-course';
import { notFound, redirect } from 'next/navigation';
import { getS3ObjectUrl } from '@/app/lib/utils';
import { ClockIcon } from 'lucide-react';
import Image from 'next/image';
import CategoryIcon from '@/app/components/category-icon';
import LevelIcon from '@/app/components/level-icon';
import type { Metadata } from 'next';
import { getSession } from '@/app/lib/auth.get-session';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const course = await getUserCourse({ courseId: id, userId: session.user.id });

  if (!course) notFound();

  return {
    title: {
      absolute: `Course: ${course.title}`,
    },
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;

  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const course = await getUserCourse({ courseId: id, userId: session.user.id });

  if (!course) notFound();

  return (
    <main className="space-y-8">
      <div className="relative aspect-video w-full">
        <Image
          src={getS3ObjectUrl(course.previewImageKey)}
          alt={course.title}
          fill
          sizes="(min-width: 1024px) 75vw, 100vw"
          className="rounded-lg object-cover"
          priority
        />
      </div>
      <h2 className="text-2xl font-bold">{course.title}</h2>
      <p>{course.briefDescription}</p>
      <hr />
      <ul className="flex flex-wrap gap-x-4 gap-y-2">
        <li className="flex items-center gap-x-2">
          <span className="bg-primary/20 text-primary grid size-10 place-items-center rounded-full">
            <CategoryIcon categoryName={course.categoryName} className="size-5" />
          </span>
          <div>
            <h4 className="text-sm font-medium">Category</h4>
            <p className="text-muted-foreground text-sm">{course.categoryName}</p>
          </div>
        </li>
        <li className="flex items-center gap-x-2">
          <span className="bg-primary/20 text-primary grid size-10 place-items-center rounded-full">
            <LevelIcon level={course.level} className="size-5" />
          </span>
          <div>
            <h4 className="text-sm font-medium">Level</h4>
            <p className="text-muted-foreground text-sm">{course.level}</p>
          </div>
        </li>
        <li className="flex items-center gap-x-2">
          <span className="bg-primary/20 text-primary grid size-10 place-items-center rounded-full">
            <ClockIcon className="size-5" />
          </span>
          <div>
            <h4 className="text-sm font-medium">Duration</h4>
            <p className="text-muted-foreground text-sm">{course.duration} min</p>
          </div>
        </li>
      </ul>
      <hr />
      <div
        className="prose prose-neutral prose-sm sm:prose-base dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: course.description }}
      />
    </main>
  );
}
