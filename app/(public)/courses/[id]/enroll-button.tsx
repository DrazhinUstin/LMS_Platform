'use client';

import ButtonLoading from '@/app/components/button-loading';
import { cn } from '@/app/lib/utils';
import { CreditCardIcon } from 'lucide-react';
import { enrollInCourse } from './actions';
import { useTransition } from 'react';
import { toast } from 'sonner';

export default function EnrollButton({
  courseId,
  className,
}: {
  courseId: string;
  className?: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      try {
        await enrollInCourse(courseId);
      } catch {
        toast.error('Failed to enroll in course. Please try again.');
      }
    });
  };

  return (
    <ButtonLoading
      type="button"
      className={cn('w-full', className)}
      onClick={handleClick}
      loading={isPending}
    >
      <CreditCardIcon />
      Enroll in course
    </ButtonLoading>
  );
}
