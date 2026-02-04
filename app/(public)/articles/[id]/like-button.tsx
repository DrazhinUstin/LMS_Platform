'use client';

import ButtonLoading from '@/app/components/button-loading';
import { useTransition } from 'react';
import { toggleLike } from './actions';
import { toast } from 'sonner';

export default function LikeButton({
  articleId,
  children,
  ...props
}: React.ComponentProps<typeof ButtonLoading> & { articleId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      try {
        await toggleLike(articleId);
      } catch {
        toast.error('Sorry, but there was an error. Please try again.');
      }
    });
  };

  return (
    <ButtonLoading {...props} type="button" onClick={handleClick} loading={isPending}>
      {children}
    </ButtonLoading>
  );
}
