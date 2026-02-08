import { getArticle } from '@/app/data/article/get-article';
import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getS3ObjectUrl } from '@/app/lib/utils';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Omit<Props, 'children'>): Promise<Metadata> {
  const id = (await params).id;

  const article = await getArticle({ id });

  if (!article) notFound();

  return {
    title: `Comments - ${article.title}`,
  };
}

export default async function Layout({ params, children }: Props) {
  const { id } = await params;

  const article = await getArticle({ id });

  if (!article) notFound();

  return (
    <div className="mx-auto w-[90vw] max-w-2xl space-y-8 py-8">
      <Link
        href={`/articles/${article.id}`}
        className="hover:text-primary flex w-max items-center gap-x-4 transition-colors"
      >
        <ArrowLeftIcon />
        {!!article.posterKey && (
          <div className="relative aspect-video w-20 shrink-0">
            <Image
              src={getS3ObjectUrl(article.posterKey)}
              alt={article.title}
              fill
              sizes="80px"
              className="rounded-sm object-cover"
            />
          </div>
        )}
        <h4 className="font-semibold">{article.title}</h4>
      </Link>
      {children}
    </div>
  );
}
