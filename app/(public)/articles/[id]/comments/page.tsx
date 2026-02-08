import PaginationBar from '@/app/components/pagination-bar';
import SortOrder from '@/app/components/sort-order';
import { getComments } from '@/app/data/comment/get-comments';
import { getCommentsCount } from '@/app/data/comment/get-comments-count';
import { CommentSortingOrder } from '@/app/lib/definitions';
import { Suspense } from 'react';
import CommentCard, { CommentCardSkeleton } from './comment-card';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page(props: Props) {
  const [{ id }, searchParams] = await Promise.all([props.params, props.searchParams]);

  const { order, page } = searchParams;

  const currentPage = Number(page) || 1;

  return (
    <main className="space-y-8">
      <h2 className="text-center text-2xl font-bold">All Comments</h2>
      <div className="space-y-8">
        <div className="flex justify-end">
          <SortOrder options={Object.entries(CommentSortingOrder)} />
        </div>
        <Suspense key={JSON.stringify(searchParams)} fallback={<CommentsListSkeleton />}>
          <CommentsList
            filters={{ articleId: id }}
            order={order as keyof typeof CommentSortingOrder}
            page={currentPage}
          />
        </Suspense>
      </div>
    </main>
  );
}

async function CommentsList({ filters, order, page }: Parameters<typeof getComments>[0]) {
  const [comments, count] = await Promise.all([
    getComments({ filters, order, page, commentsPerPage }),
    getCommentsCount({ filters }),
  ]);

  const totalPages = Math.ceil(count / commentsPerPage);

  return (
    <div>
      <div className="space-y-8">
        {comments.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))}
      </div>
      {comments.length === 0 && (
        <p className="text-center">Unfortunately, there are no comments for this article 😞</p>
      )}
      <PaginationBar currentPage={page as number} totalPages={totalPages} className="mt-8" />
    </div>
  );
}

function CommentsListSkeleton() {
  return (
    <div className="space-y-8">
      {Array.from({ length: commentsPerPage }).map((_, index) => (
        <CommentCardSkeleton key={index} />
      ))}
    </div>
  );
}

const commentsPerPage = 12;
