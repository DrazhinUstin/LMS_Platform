'use client';

import { Session } from '@/app/lib/auth';
import { useTransition } from 'react';
import { ProfileSchema } from '@/app/lib/schemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/components/ui/form';
import { Input } from '@/app/components/ui/input';
import ButtonLoading from '@/app/components/button-loading';
import { editProfile } from './actions';
import { Textarea } from '@/app/components/ui/textarea';

export default function EditProfileForm({ user }: { user: Session['user'] }) {
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: user.name,
      shortBio: user.shortBio ?? '',
    },
  });

  function onSubmit(values: z.output<typeof ProfileSchema>) {
    startTransition(async () => {
      try {
        const editedProfile = await editProfile(values);

        form.reset({
          name: editedProfile.name,
          shortBio: editedProfile.shortBio ?? '',
        });

        toast('Profile edited successfully!');
      } catch {
        toast.error('Failed to edit a profile. Please try again.');
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto w-full max-w-2xl space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="shortBio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short bio</FormLabel>
              <FormControl>
                <Textarea
                  className="resize-none"
                  placeholder="Add a little info about yourself..."
                  {...field}
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
