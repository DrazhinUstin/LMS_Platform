import { Progress } from '@/app/components/ui/progress';
import { UserCourseTypeWithInclude } from '@/app/data/course/get-user-course';
import Link from 'next/link';

export default function CourseProgress({ course }: { course: UserCourseTypeWithInclude }) {
  const totalLessons = course.chapters.reduce((acc, chapter) => acc + chapter._count.lessons, 0);

  const totalCompletedLessons = course.chapters.reduce((acc, chapter) => {
    let chapterLessonsCompleted = 0;

    chapter.lessons.forEach(
      (lesson) => lesson.userProgresses[0]?.isCompleted && chapterLessonsCompleted++
    );

    return acc + chapterLessonsCompleted;
  }, 0);

  return (
    <div className="space-y-2">
      <h3 className="truncate text-xl font-semibold">
        <Link href={`/dashboard/courses/${course.id}`}>{course.title}</Link>
      </h3>
      <Progress value={(totalCompletedLessons / totalLessons) * 100} />
      <p className="text-muted-foreground flex justify-between gap-x-1 text-xs">
        <span>Completed lessons: {totalCompletedLessons}</span>
        <span>Total lessons: {totalLessons}</span>
      </p>
    </div>
  );
}
