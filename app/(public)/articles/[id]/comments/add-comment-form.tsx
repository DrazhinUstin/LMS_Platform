'use client';

import { CommentSchema } from '@/app/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { createComment } from './actions';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/app/components/ui/form';
import { Textarea } from '@/app/components/ui/textarea';
import { Loader2Icon, SendIcon } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

export default function AddCommentForm({ articleId }: { articleId: string }) {
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
        await createComment(articleId, values);

        form.reset();

        toast('Comment was added successfully!');
      } catch {
        toast.error('Failed to add a comment. Please try again.');
      }
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-[1fr_auto] items-center gap-x-2"
      >
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea className="resize-none" placeholder="Write your comment..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant="secondary" size="icon-lg" disabled={isPending}>
          {isPending ? <Loader2Icon className="animate-spin" /> : <SendIcon />}
        </Button>
      </form>
    </Form>
  );
}
