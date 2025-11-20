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
import { Input } from '@/app/components/ui/input';
import { useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ChapterSchema } from '@/app/lib/schemas';
import { toast } from 'sonner';
import { editChapter } from './actions';
import { SquarePenIcon } from 'lucide-react';
import type { Prisma } from '@/generated/prisma';

type ChapterData = Prisma.ChapterGetPayload<{ select: { id: true; title: true } }>;

export default function EditChapterDialog({ chapter }: { chapter: ChapterData }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(ChapterSchema),
    defaultValues: {
      title: chapter.title,
    },
  });

  function onSubmit(values: z.infer<typeof ChapterSchema>) {
    startTransition(async () => {
      try {
        await editChapter(chapter.id, values);

        setIsDialogOpen(false);

        toast('Chapter was edited successfully!');
      } catch {
        toast.error('Failed to edit a chapter. Please try again.');
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
        <Button variant="ghost" size="icon" title="Edit chapter">
          <SquarePenIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit chapter</DialogTitle>
          <DialogDescription>Fill in the form fields and click the edit button.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="The title of a chapter" {...field} />
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
                Edit
              </ButtonLoading>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
