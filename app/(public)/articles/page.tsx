import Filters from './filters';
import SortOrder from '@/app/components/sort-order';
import { Suspense } from 'react';
import { getCategories } from '@/app/data/category/get-categories';
import PaginationBar from '@/app/components/pagination-bar';
import type { Metadata } from 'next';
import { ArticleSortingOrder } from '@/app/lib/definitions';
import { getArticles } from '@/app/data/article/get-articles';
import { getArticlesCount } from '@/app/data/article/get-articles-count';
import ArticleCard, { ArticleCardSkeleton } from './article-card';

export const metadata: Metadata = {
  title: 'Articles',
};

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page(props: Props) {
  const searchParams = await props.searchParams;

  const { order, page, ...filters } = searchParams;

  const currentPage = Number(page) || 1;

  const categories = await getCategories();

  return (
    <main className="mx-auto w-[90vw] max-w-7xl space-y-8 py-8">
      <h2 className="text-center text-2xl font-bold">Articles</h2>
      <div className="grid gap-8 lg:grid-cols-[auto_1fr] lg:items-start">
        <div className="lg:sticky lg:top-[7rem] lg:w-60">
          <Filters categories={categories} />
        </div>
        <div className="space-y-8">
          <div className="flex justify-end">
            <SortOrder options={Object.entries(ArticleSortingOrder)} />
          </div>
          <Suspense key={JSON.stringify(searchParams)} fallback={<ArticlesListSkeleton />}>
            <ArticlesList
              filters={{ ...filters, status: 'PUBLISHED' }}
              order={order as keyof typeof ArticleSortingOrder}
              page={currentPage}
            />
          </Suspense>
        </div>
      </div>
    </main>
  );
}

async function ArticlesList({ filters, order, page }: Parameters<typeof getArticles>[0]) {
  const [articles, count] = await Promise.all([
    getArticles({ filters, order, page, articlesPerPage }),
    getArticlesCount({ filters }),
  ]);

  const totalPages = Math.ceil(count / articlesPerPage);

  return (
    <div>
      <div className="space-y-8">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
      {articles.length === 0 && (
        <p className="text-center">Unfortunately, no articles matching your query were found 😞</p>
      )}
      <PaginationBar currentPage={page as number} totalPages={totalPages} className="mt-8" />
    </div>
  );
}

function ArticlesListSkeleton() {
  return (
    <div className="space-y-8">
      {Array.from({ length: articlesPerPage }).map((_, index) => (
        <ArticleCardSkeleton key={index} />
      ))}
    </div>
  );
}

const articlesPerPage = 8;
