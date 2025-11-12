import { getS3ObjectUrl } from '@/app/lib/utils';
import type { Lesson } from '@/generated/prisma';
import Image from 'next/image';

export default function LessonDetails({ lesson }: { lesson: Lesson }) {
  const { title, description, videoKey, posterKey } = lesson;
  return (
    <div className="space-y-8">
      {videoKey && (
        <div className="relative aspect-video w-full">
          <video
            src={getS3ObjectUrl(videoKey)}
            poster={posterKey ? getS3ObjectUrl(posterKey) : undefined}
            title={title}
            className="absolute inset-0 z-10 h-full w-full"
            preload="metadata"
            controls
          >
            Your browser does not support the video tag.
          </video>
        </div>
      )}
      {!videoKey && posterKey && (
        <div className="relative aspect-video w-full">
          <Image
            src={getS3ObjectUrl(posterKey)}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            priority
          />
        </div>
      )}
      <h2 className="text-2xl font-bold">{title}</h2>
      {description && (
        <div
          className="prose prose-neutral prose-sm sm:prose-base dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}
    </div>
  );
}
