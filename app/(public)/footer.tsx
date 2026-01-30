import GithubMark from '@/app/components/github-mark';
import Link from 'next/link';
import { Separator } from '@/app/components/ui/separator';

export default function Footer() {
  return (
    <footer className="flex h-24 items-center border-t py-2">
      <div className="mx-auto w-[90vw] max-w-7xl">
        <div className="flex flex-col items-center gap-2 md:flex-row md:justify-between">
          <nav className="flex h-5 items-center gap-x-4 text-sm">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <Separator orientation="vertical" />
            <Link href="/courses" className="hover:text-primary transition-colors">
              Courses
            </Link>
            <Separator orientation="vertical" />
            <Link href="/articles" className="hover:text-primary transition-colors">
              Articles
            </Link>
          </nav>
          <p className="text-xs">
            &copy; {new Date().getFullYear()} LMS Platform. All rights reserved.
          </p>
          <div className="flex items-center gap-x-2">
            <a
              href="https://github.com/DrazhinUstin/LMS_Platform"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GithubMark className="size-4 md:size-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
