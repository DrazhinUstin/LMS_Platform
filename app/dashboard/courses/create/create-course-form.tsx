'use client';

import { CourseSchema } from '@/app/lib/schemas';
import { type Category, CourseLevel, CourseStatus } from '@/generated/prisma';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/components/ui/form';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import TextEditor from '@/app/components/text-editor';
import ButtonLoading from '@/app/components/button-loading';
import FileUploader from '@/app/components/file-uploader';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

export default function CreateCourseForm({ categories }: { categories: Category[] }) {
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(CourseSchema),
    defaultValues: {
      title: '',
      previewImageKey: '',
      briefDescription: '',
      description: '',
      duration: '',
      price: '',
      categoryName: '',
      level: Object.values(CourseLevel)[0],
      status: Object.values(CourseStatus)[0],
    },
  });

  function onSubmit(values: z.output<typeof CourseSchema>) {
    startTransition(async () => {
      try {
        const response = await fetch('/api/courses/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error();
        }

        toast('Course created successfully!');

        router.push('/dashboard/courses');
      } catch {
        toast.error('Failed to create a course. Please try again.');
      }
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto w-full max-w-[820px] space-y-8 rounded-md border p-8 shadow-md"
      >
        <FormField
          control={form.control}
          name="categoryName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map(({ id, name }) => (
                    <SelectItem key={id} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                <Input placeholder="The title of your course" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="briefDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brief description</FormLabel>
              <FormControl>
                <Textarea
                  className="resize-none"
                  placeholder="Some brief info about your course"
                  {...field}
                />
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
                  placeholder="Detailed info about your course"
                  charactersLimit={5000}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration (in minutes)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="The duration of your course (in minutes)"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price (in cents)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="The price of your course (in cents)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Level</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a difficulty level of your course" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(CourseLevel).map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a status of your course" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(CourseStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="previewImageKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preview image</FormLabel>
              <FormControl>
                <FileUploader onFileUploaded={field.onChange} acceptedFileType="image" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <ButtonLoading type="submit" className="w-full" loading={isPending}>
          Submit
        </ButtonLoading>
      </form>
    </Form>
  );
}
