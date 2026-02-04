import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getArticle } from '@/app/data/article/get-article';
import ArticleDetail from './article-detail';
import ArticleLikes, { ArticleLikesFallback } from './article-likes';
import { Suspense } from 'react';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).id;

  const article = await getArticle({ id });

  if (!article) notFound();

  return {
    title: article.title,
    description: article.briefDescription,
  };
}

export default async function Page({ params }: Props) {
  const id = (await params).id;

  const article = await getArticle({ id });

  if (!article) notFound();

  return (
    <main className="mx-auto w-[90vw] max-w-2xl space-y-8 py-8">
      <ArticleDetail article={article} />
      <Suspense fallback={<ArticleLikesFallback likesCount={article._count.likes} />}>
        <ArticleLikes article={article} />
      </Suspense>
    </main>
  );
}
