import EditArticleForm from './edit-article-form';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getCategories } from '@/app/data/category/get-categories';
import { getSession } from '@/app/lib/auth.get-session';
import { getArticle } from '@/app/data/article/get-article';

export const metadata: Metadata = {
  title: 'Edit article',
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const [article, categories] = await Promise.all([
    getArticle({ id, authorId: session.user.id }),
    getCategories(),
  ]);

  if (!article) {
    notFound();
  }

  return (
    <main className="space-y-8">
      <h2 className="text-center text-2xl font-bold">Edit article</h2>
      <EditArticleForm article={article} categories={categories} />
    </main>
  );
}
