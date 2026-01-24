import CreateArticleForm from './create-article-form';
import type { Metadata } from 'next';
import { getCategories } from '@/app/data/category/get-categories';

export const metadata: Metadata = {
  title: 'Create article',
};

export default async function Page() {
  const categories = await getCategories();
  return (
    <main className="space-y-8">
      <h2 className="text-center text-2xl font-bold">Create new article</h2>
      <CreateArticleForm categories={categories} />
    </main>
  );
}
