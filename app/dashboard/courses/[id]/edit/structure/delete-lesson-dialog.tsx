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
import { deleteLesson } from './actions';
import { Trash2Icon } from 'lucide-react';

export default function DeleteLessonDialog({ lessonId }: { lessonId: string }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      try {
        await deleteLesson(lessonId);

        setIsDialogOpen(false);

        toast('Lesson was deleted successfully!');
      } catch {
        toast.error('Failed to delete a lesson. Please try again.');
      }
    });
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={(open) => !isPending && setIsDialogOpen(open)}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" title="Delete lesson">
          <Trash2Icon className="text-destructive" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete lesson</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the lesson with all its content? This action cannot be
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
