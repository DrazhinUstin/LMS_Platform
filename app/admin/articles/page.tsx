import { Button } from '@/app/components/ui/button';
import { PlusIcon } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSession } from '@/app/lib/auth.get-session';
import { prisma } from '@/app/lib/prisma';
import ArticleCard from './article-card';

export const metadata: Metadata = {
  title: 'Articles',
};

export default async function Page() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const articles = await prisma.article.findMany({ where: { authorId: session.user.id } });

  return (
    <main className="space-y-8">
      <Button asChild>
        <Link href="/admin/articles/create">
          <PlusIcon />
          Create article
        </Link>
      </Button>
      <h2 className="text-center text-2xl font-bold">Created articles</h2>
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </main>
  );
}
