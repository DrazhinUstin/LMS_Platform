import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, locale = 'en-US', currency = 'USD') {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
}

export function getS3ObjectUrl(s3Key: string) {
  return `https://lms-platform-by-ustin.t3.storage.dev/${s3Key}`;
}
