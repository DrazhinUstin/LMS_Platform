import { Button } from '@/app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { Skeleton } from '@/app/components/ui/skeleton';
import UserAvatar from '@/app/components/user-avatar';
import type { Session } from '@/app/lib/auth';
import type { CommentSummary } from '@/app/lib/definitions';
import { EllipsisIcon } from 'lucide-react';
import EditCommentDialog from './edit-comment-dialog';
import DeleteCommentDialog from './delete-comment-dialog';

export default function CommentCard({
  comment,
  loggedInUser,
}: {
  comment: CommentSummary;
  loggedInUser: Session['user'] | null;
}) {
  return (
    <div className="grid w-full max-w-sm grid-cols-[auto_1fr] gap-x-4">
      <UserAvatar src={comment.user.image} width={40} height={40} className="size-10" />
      <div className="space-y-2 rounded-lg border p-2 text-sm">
        <div className="flex h-6 items-center justify-between gap-x-2">
          <h4 className="font-medium">{comment.user.name ?? 'Anonymous'}</h4>
          {loggedInUser && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm" className="size-6">
                  <EllipsisIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {loggedInUser.id === comment.user.id && (
                  <>
                    <div>
                      <EditCommentDialog comment={comment} className="w-full" />
                    </div>
                    <DropdownMenuSeparator />
                    <div>
                      <DeleteCommentDialog comment={comment} className="w-full" />
                    </div>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
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
        <div className="flex h-6 items-center">
          <Skeleton className="h-5 w-1/2" />
        </div>
        <Skeleton className="h-14 w-full" />
      </div>
    </div>
  );
}
