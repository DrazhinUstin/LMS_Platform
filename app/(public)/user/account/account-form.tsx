'use client';

import { Session } from '@/app/lib/auth';
import { AccountSchema } from '@/app/lib/schemas';
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
import { Input } from '@/app/components/ui/input';

export default function AccountForm({ user }: { user: Session['user'] }) {
  const form = useForm({
    resolver: zodResolver(AccountSchema),
    defaultValues: {
      email: user.email,
    },
  });

  return (
    <Form {...form}>
      <form className="mx-auto w-full max-w-2xl space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="amadeus666@mail.com" {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
