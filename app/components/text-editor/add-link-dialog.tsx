import { useEditorState, type Editor } from '@tiptap/react';
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
import { LinkIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
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
import { cn } from '@/app/lib/utils';

const FormSchema = z.object({
  url: z.url(),
});

export default function AddLinkDialog({ editor }: { editor: Editor }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        isLink: ctx.editor.isActive('link'),
        canLink: ctx.editor.can().chain().toggleLink().run() ?? false,
      };
    },
  });

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      url: '',
    },
  });

  const activeUrl = editor.getAttributes('link').href;

  useEffect(() => {
    form.reset({ url: activeUrl || '' });
  }, [form, activeUrl]);

  function addLink(values: z.infer<typeof FormSchema>) {
    editor.chain().focus().extendMarkRange('link').setLink({ href: values.url }).run();

    setIsDialogOpen(false);
  }

  function removeLink() {
    editor.chain().focus().extendMarkRange('link').unsetLink().run();

    setIsDialogOpen(false);
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
          title="Link"
          disabled={!editorState.canLink}
          className={cn('size-8', editorState.isLink && 'border-primary dark:border-primary')}
        >
          <LinkIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter URL</DialogTitle>
          <DialogDescription>Provide valid url for the link.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://www.example.com" />
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
              {!!activeUrl && (
                <Button type="button" variant="destructive" onClick={removeLink}>
                  Remove link
                </Button>
              )}
              <Button
                type="button"
                onClick={form.handleSubmit(addLink)}
                disabled={!form.formState.isDirty}
              >
                {!!activeUrl ? 'Update link' : 'Add link'}
              </Button>
            </DialogFooter>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
