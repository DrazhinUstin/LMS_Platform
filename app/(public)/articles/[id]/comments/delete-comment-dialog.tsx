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
import { deleteComment } from './actions';
import { Trash2Icon } from 'lucide-react';
import type { CommentSummary } from '@/app/lib/definitions';

export default function DeleteCommentDialog({
  comment,
  className,
}: {
  comment: CommentSummary;
  className?: string;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      try {
        await deleteComment(comment.id);

        setIsDialogOpen(false);

        toast('Comment was deleted successfully!');
      } catch {
        toast.error('Failed to delete a comment. Please try again.');
      }
    });
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={(open) => !isPending && setIsDialogOpen(open)}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className={className}>
          <Trash2Icon className="text-destructive" />
          Delete comment
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete comment</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the comment &quot;
            <span className="text-foreground">{comment.text}</span>&quot;? This action cannot be
            undone.
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
