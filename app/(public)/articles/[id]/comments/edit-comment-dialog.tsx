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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/components/ui/form';
import { useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CommentSchema } from '@/app/lib/schemas';
import { toast } from 'sonner';
import { editComment } from './actions';
import { SquarePenIcon } from 'lucide-react';
import { Textarea } from '@/app/components/ui/textarea';
import type { CommentSummary } from '@/app/lib/definitions';

export default function EditCommentDialog({
  comment,
  className,
}: {
  comment: CommentSummary;
  className?: string;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(CommentSchema),
    defaultValues: {
      text: comment.text ?? '',
    },
  });

  function onSubmit(values: z.infer<typeof CommentSchema>) {
    startTransition(async () => {
      try {
        const editedComment = await editComment(comment.id, values);

        setIsDialogOpen(false);

        form.reset({
          text: editedComment.text ?? '',
        });

        toast('Comment was edited successfully!');
      } catch {
        toast.error('Failed to edit a comment. Please try again.');
      }
    });
  }

  function handleOpenChange(open: boolean) {
    if (isPending) return;

    setIsDialogOpen(open);

    if (!open) form.reset();
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className={className}>
          <SquarePenIcon />
          Edit comment
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit comment</DialogTitle>
          <DialogDescription>Fill in the form fields and click the edit button.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Text</FormLabel>
                  <FormControl>
                    <Textarea
                      className="resize-none"
                      placeholder="Write your comment..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isPending}>
                  Close
                </Button>
              </DialogClose>
              <ButtonLoading type="submit" loading={isPending} disabled={!form.formState.isDirty}>
                Edit
              </ButtonLoading>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
