import Image from 'next/image';
import googleMark from '@/public/google-mark.svg';
import { cn } from '@/app/lib/utils';

export default function GoogleMark({ className }: { className?: string }) {
  return <Image src={googleMark} alt="google mark" className={cn('size-5', className)} />;
}
