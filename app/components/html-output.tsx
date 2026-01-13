'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/app/components/ui/button';

export default function HTMLOutput({
  html,
  maxContainerHeight = 1000,
}: {
  html: string;
  maxContainerHeight?: number;
}) {
  const [showMoreMode, setShowMoreMode] = useState<{ activated: boolean } | null>(null);

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef) return;

    const contentHeight = contentRef.current?.offsetHeight ?? 0;

    if (contentHeight > maxContainerHeight) {
      setShowMoreMode({ activated: false });
    } else {
      setShowMoreMode(null);
    }
  }, [html, maxContainerHeight]);

  return (
    <div
      style={{ maxHeight: showMoreMode?.activated ? 'none' : maxContainerHeight }}
      className="relative overflow-y-hidden"
    >
      {showMoreMode && !showMoreMode.activated && (
        <div className="from-background/0 via-background/75 to-background/100 absolute bottom-0 left-0 h-1/4 w-full bg-linear-to-b">
          <Button
            variant="ghost"
            size="sm"
            className="absolute bottom-0 left-1/2 -translate-x-1/2"
            onClick={() => setShowMoreMode({ activated: true })}
          >
            Show more
          </Button>
        </div>
      )}
      <div
        ref={contentRef}
        className="prose prose-neutral prose-sm sm:prose-base dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
