import { getCourse } from '@/app/data/course/get-course';
import { notFound } from 'next/navigation';
import { getS3ObjectUrl } from '@/app/lib/utils';
import { ClockIcon, GraduationCapIcon, LayoutGridIcon } from 'lucide-react';
import Image from 'next/image';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const course = await getCourse(id);

  if (!course) notFound();

  return (
    <main className="space-y-8">
      <div className="relative aspect-video w-full">
        <Image
          src={getS3ObjectUrl(course.previewImageKey)}
          alt={course.title}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      </div>
      <h2 className="text-2xl font-bold">{course.title}</h2>
      <p>{course.briefDescription}</p>
      <hr />
      <ul className="flex flex-wrap gap-x-4 gap-y-2">
        <li className="flex items-center gap-x-2">
          <span className="bg-primary/20 text-primary grid size-10 place-items-center rounded-full">
            <LayoutGridIcon className="size-5" />
          </span>
          <div>
            <h4 className="text-sm font-medium">Category</h4>
            <p className="text-muted-foreground text-sm">{course.categoryName}</p>
          </div>
        </li>
        <li className="flex items-center gap-x-2">
          <span className="bg-primary/20 text-primary grid size-10 place-items-center rounded-full">
            <GraduationCapIcon className="size-5" />
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
