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
import { replyToComment } from './actions';
import { ReplyIcon } from 'lucide-react';
import { Textarea } from '@/app/components/ui/textarea';
import type { CommentSummary } from '@/app/lib/definitions';

export default function ReplyToCommentDialog({
  parent,
  className,
}: {
  parent: CommentSummary;
  className?: string;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(CommentSchema),
    defaultValues: {
      text: '',
    },
  });

  function onSubmit(values: z.infer<typeof CommentSchema>) {
    startTransition(async () => {
      try {
        await replyToComment({ articleId: parent.article.id, parentId: parent.id, data: values });

        setIsDialogOpen(false);

        form.reset();

        toast('Reply was added successfully!');
      } catch {
        toast.error('Failed to add the reply. Please try again.');
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
          <ReplyIcon />
          Reply to comment
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reply to comment</DialogTitle>
          <DialogDescription>{parent.text}</DialogDescription>
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
                      placeholder="Write your reply..."
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
              <ButtonLoading type="submit" loading={isPending}>
                Reply
              </ButtonLoading>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
