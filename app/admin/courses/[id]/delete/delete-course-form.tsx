'use client';

import ButtonLoading from '@/app/components/button-loading';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import type { CourseDetail } from '@/app/lib/definitions';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

export default function DeleteCourseForm({ course }: { course: CourseDetail }) {
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
      className="bg-card text-card-foreground mx-auto w-full max-w-4xl space-y-4 rounded-lg border p-4 shadow-md"
      onSubmit={handleSubmit}
    >
      <div className="space-y-2">
        <h4 className="text-lg font-medium">
          Delete the course{' '}
          <Link
            href={`/admin/courses/${course.id}`}
            className="hover:text-primary font-semibold transition-colors"
          >
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
