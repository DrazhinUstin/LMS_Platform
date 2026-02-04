import { getSession } from '@/app/lib/auth.get-session';
import { prisma } from '@/app/lib/prisma';
import LikeButton from './like-button';
import { ThumbsUpIcon } from 'lucide-react';
import type { ArticleDetail } from '@/app/lib/definitions';
import { Button } from '@/app/components/ui/button';
import ButtonLoading from '@/app/components/button-loading';

export default async function ArticleLikes({ article }: { article: ArticleDetail }) {
  const session = await getSession();

  if (!session) {
    return (
      <Button type="button" variant="outline">
        <ThumbsUpIcon />
        {article._count.likes}
      </Button>
    );
  }

  const like = await prisma.like.findUnique({
    where: { userId_articleId: { userId: session.user.id, articleId: article.id } },
  });

  return (
    <LikeButton
      articleId={article.id}
      variant="outline"
      title={like ? 'Unlike article' : 'Like article'}
    >
      <ThumbsUpIcon className={like ? 'fill-primary text-primary' : undefined} />
      {article._count.likes}
    </LikeButton>
  );
}

export function ArticleLikesFallback({ likesCount }: { likesCount: number }) {
  return (
    <ButtonLoading type="button" variant="outline" loading>
      {likesCount}
    </ButtonLoading>
  );
}
