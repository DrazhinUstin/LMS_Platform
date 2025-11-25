import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import { Undo2Icon } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="mx-auto grid min-h-screen w-[90vw] max-w-7xl place-items-center py-8">
      <div className="flex flex-col items-center gap-x-8 gap-y-4 lg:flex-row">
        <h1 className="text-6xl font-bold">404</h1>
        <span className="bg-border h-0.5 w-32 lg:h-32 lg:w-0.5" />
        <div className="space-y-4 text-center lg:text-left">
          <h2 className="text-2xl font-bold">Page Not Found</h2>
          <p className="text-sm lg:text-base">The resource you requested was not found</p>
          <Button asChild>
            <Link href="/">
              <Undo2Icon />
              Back to starter
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
