import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import PaginationBar from '@/app/components/pagination-bar';
import SortOrder from '@/app/components/sort-order';
import type { Metadata } from 'next';
import { getSession } from '@/app/lib/auth.get-session';
import { LikeSortingOrder } from '@/app/lib/definitions';
import { getLikes } from '@/app/data/like/get-likes';
import { getLikesCount } from '@/app/data/like/get-likes-count';
import ArticleCard, { ArticleCardSkeleton } from '@/app/(public)/articles/article-card';

export const metadata: Metadata = {
  title: 'Likes',
};

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page(props: Props) {
  const searchParams = await props.searchParams;

  const { order, page } = searchParams;

  const currentPage = Number(page) || 1;

  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <main className="space-y-8">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">Activity</h2>
        <p className="text-muted-foreground">Manage your activity hear</p>
      </div>
      <div className="space-y-8">
        <div className="flex justify-end">
          <SortOrder options={Object.entries(LikeSortingOrder)} />
        </div>
        <Suspense key={JSON.stringify(searchParams)} fallback={<LikesListSkeleton />}>
          <LikesList
            filters={{ userId: session.user.id }}
            order={order as keyof typeof LikeSortingOrder}
            page={currentPage}
          />
        </Suspense>
      </div>
    </main>
  );
}

async function LikesList({ filters, order, page }: Parameters<typeof getLikes>[0]) {
  const [likes, count] = await Promise.all([
    getLikes({ filters, order, page, likesPerPage }),
    getLikesCount({ filters }),
  ]);

  const totalPages = Math.ceil(count / likesPerPage);

  return (
    <div>
      <div className="flex flex-col gap-y-8">
        {likes.map(({ article }) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
      {likes.length === 0 && (
        <p className="text-center">Unfortunately, no liked articles were found 😞</p>
      )}
      <PaginationBar currentPage={page as number} totalPages={totalPages} className="mt-8" />
    </div>
  );
}

function LikesListSkeleton() {
  return (
    <div className="space-y-8">
      {Array.from({ length: likesPerPage }).map((_, index) => (
        <ArticleCardSkeleton key={index} />
      ))}
    </div>
  );
}

const likesPerPage = 12;
