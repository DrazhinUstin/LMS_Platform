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
import { ReviewSchema } from '@/app/lib/schemas';
import { toast } from 'sonner';
import { editReview } from './actions';
import { FeatherIcon } from 'lucide-react';
import { Textarea } from '@/app/components/ui/textarea';
import StarRating from '@/app/components/star-rating';
import type { ReviewSummary } from '@/app/lib/definitions';

export default function EditReviewDialog({
  review,
  className,
}: {
  review: ReviewSummary;
  className?: string;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(ReviewSchema),
    defaultValues: {
      rating: review.rating,
      title: review.title ?? '',
      description: review.description ?? '',
    },
  });

  function onSubmit(values: z.infer<typeof ReviewSchema>) {
    startTransition(async () => {
      try {
        const editedReview = await editReview(review.id, values);

        setIsDialogOpen(false);

        form.reset({
          rating: editedReview.rating,
          title: editedReview.title ?? '',
          description: editedReview.description ?? '',
        });

        toast('Review was edited successfully!');
      } catch {
        toast.error('Failed to edit a review. Please try again.');
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
        <Button variant="secondary" className={className}>
          <FeatherIcon />
          Edit Review
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Review</DialogTitle>
          <DialogDescription>Fill in the form fields and click the edit button.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rate the course</FormLabel>
                  <FormControl>
                    <StarRating rating={field.value} onRatingChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="The title of the review" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      className="resize-none"
                      placeholder="Share your thoughts about the course..."
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
