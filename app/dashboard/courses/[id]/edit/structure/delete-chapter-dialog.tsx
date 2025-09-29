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
import { deleteChapter } from './actions';
import { Trash2Icon } from 'lucide-react';

export default function DeleteChapterDialog({ chapterId }: { chapterId: string }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      try {
        await deleteChapter(chapterId);

        setIsDialogOpen(false);

        toast('Chapter was deleted successfully!');
      } catch {
        toast.error('Failed to delete a chapter. Please try again.');
      }
    });
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={(open) => !isPending && setIsDialogOpen(open)}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" title="Delete chapter">
          <Trash2Icon className="text-destructive" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete chapter</DialogTitle>
          <DialogDescription>
            This action cannot be undone. The chapter and all associated lessons will be permanently
            deleted.
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
