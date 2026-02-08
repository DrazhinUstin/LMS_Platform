import { Skeleton } from '@/app/components/ui/skeleton';
import UserAvatar from '@/app/components/user-avatar';
import type { CommentSummary } from '@/app/lib/definitions';

export default function CommentCard({ comment }: { comment: CommentSummary }) {
  return (
    <div className="grid w-full max-w-sm grid-cols-[auto_1fr] gap-x-4">
      <UserAvatar src={comment.user.image} width={40} height={40} className="size-10" />
      <div className="space-y-2 rounded-lg border p-2 text-sm">
        <div>
          <h4 className="font-medium">{comment.user.name ?? 'Anonymous'}</h4>
        </div>
        {comment.parent && (
          <div className="bg-accent text-accent-foreground space-y-1 rounded-lg p-2">
            <h4 className="font-medium">{comment.parent.user.name ?? 'Anonymous'}</h4>
            <p>{comment.parent.text}</p>
          </div>
        )}
        <p>{comment.text}</p>
      </div>
    </div>
  );
}

export function CommentCardSkeleton() {
  return (
    <div className="grid w-full max-w-sm grid-cols-[auto_1fr] gap-x-4">
      <Skeleton className="size-10 rounded-full" />
      <div className="space-y-2 rounded-lg border p-2">
        <div>
          <Skeleton className="h-5 w-1/2" />
        </div>
        <Skeleton className="h-14 w-full" />
      </div>
    </div>
  );
}
