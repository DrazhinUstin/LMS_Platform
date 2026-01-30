import { notFound, redirect } from 'next/navigation';
import { getSession } from '@/app/lib/auth.get-session';
import type { Metadata } from 'next';
import { Button } from '@/app/components/ui/button';
import Link from 'next/link';
import { SquarePenIcon } from 'lucide-react';
import ArticleDetail from './article-detail';
import { getArticle } from '@/app/data/article/get-article';

export const metadata: Metadata = {
  title: 'Article preview',
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const article = await getArticle({ id, authorId: session.user.id });

  if (!article) notFound();

  return (
    <main className="mx-auto max-w-2xl space-y-8">
      <ArticleDetail article={article} />
      <Button className="w-full" asChild>
        <Link href={`/admin/articles/${article.id}/edit`}>
          <SquarePenIcon />
          Edit article
        </Link>
      </Button>
    </main>
  );
}
