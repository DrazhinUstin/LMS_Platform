import Image, { ImageProps } from 'next/image';
import default_avatar from '@/public/default_avatar.png';
import { cn } from '@/app/lib/utils';

type UserAvatarProps = Omit<ImageProps, 'src' | 'alt'> & {
  src?: ImageProps['src'] | null;
  alt?: ImageProps['alt'] | null;
};

export default function UserAvatar({
  src,
  alt,
  className,
  width,
  height,
  ...props
}: UserAvatarProps) {
  return (
    <Image
      src={src || default_avatar}
      alt={alt || 'user avatar'}
      className={cn('rounded-full', className)}
      width={src ? width : undefined}
      height={src ? height : undefined}
      {...props}
    />
  );
}
