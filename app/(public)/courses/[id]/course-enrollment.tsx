import { Button } from '@/app/components/ui/button';
import { CirclePlayIcon, Loader2Icon, LogInIcon } from 'lucide-react';
import Link from 'next/link';
import EnrollButton from './enroll-button';
import { getEnrollment } from '@/app/data/enrollment/get-enrollment';
import { getSession } from '@/app/lib/auth.get-session';

export default async function CourseEnrollment({ courseId }: { courseId: string }) {
  const session = await getSession();

  if (!session) {
    return (
      <div className="space-y-2">
        <p className="text-muted-foreground text-center text-sm">Only logged in users can enroll</p>
        <Button className="w-full" asChild>
          <Link href="/login">
            <LogInIcon />
            Login
          </Link>
        </Button>
      </div>
    );
  }

  const enrollment = await getEnrollment({ userId: session.user.id, courseId });

  if (enrollment) {
    return (
      <div className="space-y-2">
        <p className="text-muted-foreground text-center text-sm">You already own this course</p>
        <Button className="w-full" asChild>
          <Link href={`/customer/courses/${courseId}`}>
            <CirclePlayIcon />
            Watch course
          </Link>
        </Button>
      </div>
    );
  }

  return <EnrollButton courseId={courseId} />;
}

export function CourseEnrollmentFallback() {
  return (
    <Button type="button" className="w-full">
      <Loader2Icon className="animate-spin" />
    </Button>
  );
}
