'use client';

import { LessonSchema } from '@/app/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { editLesson } from './actions';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/components/ui/form';
import { Input } from '@/app/components/ui/input';
import TextEditor from '@/app/components/text-editor';
import FileUploader from '@/app/components/file-uploader';
import ButtonLoading from '@/app/components/button-loading';
import type { LessonDetail } from '@/app/lib/definitions';

export default function EditLessonForm({ lesson }: { lesson: LessonDetail }) {
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(LessonSchema),
    defaultValues: {
      title: lesson.title,
      description: lesson.description ?? undefined,
      posterKey: lesson.posterKey ?? undefined,
      videoKey: lesson.videoKey ?? undefined,
    },
  });

  function onSubmit(values: z.output<typeof LessonSchema>) {
    startTransition(async () => {
      try {
        const editedLesson = await editLesson(lesson.id, values);

        form.reset({
          title: editedLesson.title,
          description: editedLesson.description ?? undefined,
          posterKey: editedLesson.posterKey ?? undefined,
          videoKey: editedLesson.videoKey ?? undefined,
        });

        toast('Lesson edited successfully!');
      } catch {
        toast.error('Failed to edit a lesson. Please try again.');
      }
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-card text-card-foreground mx-auto w-full max-w-4xl space-y-8 rounded-lg border p-8 shadow-md"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="The title of your course" {...field} />
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
                <TextEditor
                  content={field.value}
                  onContentUpdate={field.onChange}
                  placeholder="Detailed info about the lesson"
                  charactersLimit={5000}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="posterKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Poster image</FormLabel>
              <FormControl>
                <FileUploader
                  s3key={field.value}
                  onFileUploaded={field.onChange}
                  acceptedFileType="image"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="videoKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Video</FormLabel>
              <FormControl>
                <FileUploader
                  s3key={field.value}
                  onFileUploaded={field.onChange}
                  acceptedFileType="video"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <ButtonLoading
          type="submit"
          className="w-full"
          loading={isPending}
          disabled={!form.formState.isDirty}
        >
          Submit
        </ButtonLoading>
      </form>
    </Form>
  );
}
