import type { Editor } from '@tiptap/react';
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
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { YoutubeIcon } from 'lucide-react';
import { useState } from 'react';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/components/ui/form';

const youtubeRegex =
  /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:\S+)?$/;

const FormSchema = z.object({
  videoUrl: z.url().refine((val) => youtubeRegex.test(val), {
    error: 'Please provide a valid YouTube video, Shorts, or Live URL.',
  }),
});

export default function AddYoutubeVideoDialog({ editor }: { editor: Editor }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      videoUrl: '',
    },
  });

  function addYoutubeVideo(values: z.infer<typeof FormSchema>) {
    editor.chain().focus().setYoutubeVideo({ src: values.videoUrl }).run();

    setIsDialogOpen(false);

    form.reset();
  }

  function handleOpenChange(open: boolean) {
    setIsDialogOpen(open);

    if (!open) form.reset();
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          title="Add YouTube video"
          className="size-8"
        >
          <YoutubeIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter YouTube video URL</DialogTitle>
          <DialogDescription>
            Provide the link to the YouTube video you want to display.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="videoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video URL</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://www.youtube.com..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="button"
                onClick={form.handleSubmit(addYoutubeVideo)}
                disabled={!form.formState.isDirty}
              >
                Add video
              </Button>
            </DialogFooter>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
