'use client';

import ButtonLoading from '@/app/components/button-loading';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import type { Course } from '@/generated/prisma';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

export default function DeleteCourseForm({ course }: { course: Course }) {
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState('');

  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const response = await fetch(`/api/courses/${course.id}/delete`, { method: 'DELETE' });

        if (!response.ok) {
          throw new Error();
        }

        router.push('/admin/courses');

        toast.success('Course was deleted successfully!');
      } catch {
        toast.error('Failed to delete a course. Please try again.');
      }
    });
  };

  return (
    <form
      className="mx-auto w-full max-w-[820px] space-y-4 rounded-md border p-4 shadow-md"
      onSubmit={handleSubmit}
    >
      <div className="space-y-2">
        <h4 className="text-lg font-semibold">
          Delete the course{' '}
          <Link href={`/admin/courses/${course.id}/edit`} className="text-primary hover:underline">
            &quot;{course.title}&quot;
          </Link>
          ?
        </h4>
        <p>This action cannot be undone and will delete the course and all associated data</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="title">Enter the course title to confirm deletion</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-x-4">
        <Button asChild>
          <Link href="/admin/courses">Cancel</Link>
        </Button>
        <ButtonLoading
          type="submit"
          variant="destructive"
          disabled={title !== course.title}
          loading={isPending}
        >
          Delete
        </ButtonLoading>
      </div>
    </form>
  );
}
