import { StarIcon } from 'lucide-react';
import { cn } from '@/app/lib/utils';

export default function StarRating({
  rating,
  size = 'base',
}: {
  rating: number;
  size?: 'base' | 'lg';
}) {
  return (
    <div className="flex items-center gap-x-1">
      <span className={cn('mr-1 text-base leading-0 font-medium', size === 'lg' && 'text-lg')}>
        {rating.toFixed(1)}
      </span>
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon
          key={i}
          className={cn(
            'fill-input text-input size-4 shrink-0',
            size === 'lg' && 'size-5',
            i < Math.round(rating) && 'fill-primary text-primary'
          )}
        />
      ))}
    </div>
  );
}
