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
import { LessonSchema } from '@/app/lib/schemas';
import { toast } from 'sonner';
import { createLesson } from './actions';
import { PlusIcon } from 'lucide-react';

export default function CreateLessonDialog({ chapterId }: { chapterId: string }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(LessonSchema),
    defaultValues: {
      title: '',
    },
  });

  function onSubmit(values: z.infer<typeof LessonSchema>) {
    startTransition(async () => {
      try {
        await createLesson(chapterId, values);

        setIsDialogOpen(false);

        form.reset();

        toast('Lesson was created successfully!');
      } catch {
        toast.error('Failed to create a lesson. Please try again.');
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
        <Button variant="secondary" className="w-full">
          <PlusIcon />
          Create lesson
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create lesson</DialogTitle>
          <DialogDescription>
            Fill in the form fields and click the create button.
          </DialogDescription>
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
                    <Input placeholder="The title of new lesson" {...field} />
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
                Create
              </ButtonLoading>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
