import type { CourseSortingOrder, ReviewSortingOrder } from '@/app/lib/definitions';

export const courseSortingOrderData: {
  id: number;
  name: string;
  value: CourseSortingOrder;
}[] = [
  { id: 1, name: 'Newest first', value: { createdAt: 'desc' } },
  { id: 2, name: 'Oldest first', value: { createdAt: 'asc' } },
  { id: 3, name: 'Most expensive first', value: { price: 'desc' } },
  { id: 4, name: 'Less expensive first', value: { price: 'asc' } },
  { id: 5, name: 'Top rated first', value: { avgRating: 'desc' } },
  { id: 6, name: 'Low rated first', value: { avgRating: 'asc' } },
];

export const reviewSortingOrderData: {
  id: number;
  name: string;
  value: ReviewSortingOrder;
}[] = [
  { id: 1, name: 'Newest first', value: { createdAt: 'desc' } },
  { id: 2, name: 'Oldest first', value: { createdAt: 'asc' } },
  { id: 3, name: 'Top rated first', value: { rating: 'desc' } },
  { id: 4, name: 'Low rated first', value: { rating: 'asc' } },
];
