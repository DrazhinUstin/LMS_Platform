import CategoryIcon from '@/app/components/category-icon';
import { Badge } from '@/app/components/ui/badge';
import { formatDate, getS3ObjectUrl } from '@/app/lib/utils';
import { ClockIcon, MessageCircleIcon, ThumbsUpIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Skeleton } from '@/app/components/ui/skeleton';
import type { ArticleSummary } from '@/app/lib/definitions';

export default function ArticleCard({ article }: { article: ArticleSummary }) {
  return (
    <Link href={`/articles/${article.id}`}>
      <article className="bg-card text-card-foreground mx-auto w-full max-w-2xl space-y-4 rounded-lg border p-4 shadow-md">
        <div className="flex items-center gap-2">
          <p className="text-muted-foreground text-sm">{formatDate(article.createdAt)}</p>
          {article.status === 'DRAFT' && <Badge variant="secondary">{article.status}</Badge>}
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          {article.posterKey && (
            <div className="relative aspect-video w-full sm:flex-1">
              <Image
                src={getS3ObjectUrl(article.posterKey)}
                alt={article.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 672px) 33vw, 212px"
                className="rounded-md object-cover"
              />
            </div>
          )}
          <div className="space-y-4 sm:-order-1 sm:flex-2">
            <h4 className="line-clamp-2 font-semibold">{article.title}</h4>
            <p className="text-muted-foreground line-clamp-3 text-sm">{article.briefDescription}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge>
            <CategoryIcon categoryName={article.categoryName} />
            {article.categoryName}
          </Badge>
          <Badge variant="secondary">
            <ClockIcon />
            {article.readingTime} min read
          </Badge>
          <Badge variant="outline">
            <ThumbsUpIcon />
            {article._count.likes}
          </Badge>
          <Badge variant="outline">
            <MessageCircleIcon />
            {article._count.comments}
          </Badge>
        </div>
      </article>
    </Link>
  );
}

export function ArticleCardSkeleton() {
  return (
    <article className="bg-card text-card-foreground mx-auto w-full max-w-2xl space-y-4 rounded-lg border p-4 shadow-md">
      <Skeleton className="h-5 w-20" />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Skeleton className="aspect-video w-full sm:flex-1" />
        <div className="space-y-4 sm:-order-1 sm:flex-2">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-14 w-full" />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-8" />
        <Skeleton className="h-5 w-8" />
      </div>
    </article>
  );
}
