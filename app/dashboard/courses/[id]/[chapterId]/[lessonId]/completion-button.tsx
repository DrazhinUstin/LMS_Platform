'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';
import { toggleLessonCompletion } from './actions';
import ButtonLoading from '@/app/components/button-loading';
import { CircleCheckIcon, CircleXIcon } from 'lucide-react';

export default function CompletionButton({
  lessonId,
  isLessonCompleted,
}: {
  lessonId: string;
  isLessonCompleted: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      try {
        await toggleLessonCompletion(lessonId);
      } catch {
        toast.error('Failed to toggle lesson completion. Please try again.');
      }
    });
  };

  return (
    <ButtonLoading type="button" variant="outline" loading={isPending} onClick={handleClick}>
      {isLessonCompleted ? (
        <>
          <CircleXIcon className="text-red-500" />
          Remove completion
        </>
      ) : (
        <>
          <CircleCheckIcon className="text-green-500" />
          Mark as completed
        </>
      )}
    </ButtonLoading>
  );
}
