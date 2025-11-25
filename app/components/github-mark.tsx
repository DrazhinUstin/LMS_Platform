'use client';

import Image from 'next/image';
import githubMark from '@/public/github-mark.svg';
import githubMarkWhite from '@/public/github-mark-white.svg';
import { useTheme } from 'next-themes';
import { cn } from '@/app/lib/utils';
import { useEffect, useState } from 'react';

export default function GithubMark({ className }: { className?: string }) {
  const { resolvedTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <Image
      src={resolvedTheme === 'dark' ? githubMarkWhite : githubMark}
      alt="github mark"
      className={cn('size-5', className)}
    />
  );
}
