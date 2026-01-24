'use client';

import { ArticleSchema } from '@/app/lib/schemas';
import { type Category, ArticleStatus } from '@/generated/prisma';
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

export default function CreateArticleForm({ categories }: { categories: Category[] }) {
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(ArticleSchema),
    defaultValues: {
      categoryName: '',
      title: '',
      briefDescription: '',
      content: '',
      readingTime: '',
      status: Object.values(ArticleStatus)[0],
    },
  });

  function onSubmit(values: z.output<typeof ArticleSchema>) {
    startTransition(async () => {
      try {
        const response = await fetch('/api/articles/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error();
        }

        toast('Article created successfully!');

        router.push('/admin/articles');
      } catch {
        toast.error('Failed to create an article. Please try again.');
      }
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-card text-card-foreground mx-auto w-full max-w-4xl space-y-8 rounded-lg border p-8 shadow-md"
        noValidate
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
                <Input placeholder="The title of your article" {...field} />
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
                  placeholder="A brief description of your article"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <TextEditor
                  content={field.value}
                  onContentUpdate={field.onChange}
                  placeholder="The content of your article"
                  charactersLimit={5000}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="readingTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reading time (in minutes)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Estimated reading time of your article (in minutes)"
                  {...field}
                />
              </FormControl>
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
                    <SelectValue placeholder="Select a status of your article" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(ArticleStatus).map((status) => (
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
          name="posterKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Poster image</FormLabel>
              <FormControl>
                <FileUploader onFileUploaded={field.onChange} acceptedFileType="image" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <ButtonLoading type="submit" className="w-full" loading={isPending}>
          Create
        </ButtonLoading>
      </form>
    </Form>
  );
}
