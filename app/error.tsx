'use client';

import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import { HomeIcon, Undo2Icon } from 'lucide-react';

export default function Error({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto flex min-h-screen w-[90vw] max-w-7xl flex-col items-center justify-center space-y-4 py-8 text-center">
      <h1 className="text-3xl font-bold">Something went wrong!</h1>
      <p>An unexpected error occurred</p>
      <div className="space-x-4">
        <Button asChild>
          <Link href="/">
            <HomeIcon />
            Back home
          </Link>
        </Button>
        <Button variant="outline" onClick={reset}>
          <Undo2Icon />
          Try again
        </Button>
      </div>
    </main>
  );
}
