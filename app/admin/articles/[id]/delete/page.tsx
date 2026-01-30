import { notFound, redirect } from 'next/navigation';
import DeleteArticleForm from './delete-article-form';
import type { Metadata } from 'next';
import { getSession } from '@/app/lib/auth.get-session';
import { getArticle } from '@/app/data/article/get-article';

export const metadata: Metadata = {
  title: 'Delete article',
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const article = await getArticle({ id, authorId: session.user.id });

  if (!article) {
    notFound();
  }

  return (
    <main className="space-y-8">
      <h2 className="text-center text-2xl font-bold">Article deletion</h2>
      <DeleteArticleForm article={article} />
    </main>
  );
}
