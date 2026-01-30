import CategoryIcon from '@/app/components/category-icon';
import HTMLOutput from '@/app/components/html-output';
import { Badge } from '@/app/components/ui/badge';
import type { ArticleDetail } from '@/app/lib/definitions';
import { formatDate, getS3ObjectUrl } from '@/app/lib/utils';
import { Calendar1Icon, ClockIcon } from 'lucide-react';
import Image from 'next/image';

export default function ArticleDetail({ article }: { article: ArticleDetail }) {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <h2 className="text-2xl font-bold">{article.title}</h2>
      <div className="flex flex-row gap-2">
        <Badge>
          <CategoryIcon categoryName={article.categoryName} />
          {article.categoryName}
        </Badge>
        <Badge variant="secondary">
          <ClockIcon />
          {article.readingTime} min read
        </Badge>
        <Badge variant="outline">
          <Calendar1Icon />
          {formatDate(article.createdAt)}
        </Badge>
      </div>
      {article.posterKey && (
        <div className="relative aspect-video w-full">
          <Image
            src={getS3ObjectUrl(article.posterKey)}
            alt={article.title}
            fill
            sizes="(max-width: 672px) 100vw, 672px"
            className="rounded-lg object-cover"
            priority
          />
        </div>
      )}
      <HTMLOutput html={article.content} />
      <p className="text-muted-foreground text-right text-sm">
        Last updated: {formatDate(article.updatedAt)}
      </p>
    </div>
  );
}
