'use client';

import Image from 'next/image';
import githubMark from '@/public/github-mark.svg';
import githubMarkWhite from '@/public/github-mark-white.svg';
import { useTheme } from 'next-themes';
import { cn } from '@/app/lib/utils';

export default function GithubMark({ className }: { className?: string }) {
  const { theme } = useTheme();
  return (
    <Image
      src={theme === 'dark' ? githubMarkWhite : githubMark}
      alt="github mark"
      className={cn('size-5', className)}
    />
  );
}
