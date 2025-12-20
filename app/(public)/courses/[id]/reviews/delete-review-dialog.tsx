'use client';

import ButtonLoading from '@/app/components/button-loading';
import { Button } from '@/app/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/components/ui/dialog';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { deleteReview } from './actions';
import { Trash2Icon } from 'lucide-react';
import { ReviewTypeWithSelect } from '@/app/data/review/get-reviews';

export default function DeleteReviewDialog({ review }: { review: ReviewTypeWithSelect }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      try {
        await deleteReview(review.id);

        setIsDialogOpen(false);

        toast('Review was deleted successfully!');
      } catch {
        toast.error('Failed to delete a review. Please try again.');
      }
    });
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={(open) => !isPending && setIsDialogOpen(open)}>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <Trash2Icon />
          Delete Review
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Review</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the review on the course &quot;{review.course.title}
            &quot;? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isPending}>
              Close
            </Button>
          </DialogClose>
          <ButtonLoading variant="destructive" onClick={handleDelete} loading={isPending}>
            Delete
          </ButtonLoading>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
