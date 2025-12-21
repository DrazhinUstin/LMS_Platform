import type { Course, CourseLevel, Prisma, Review } from '@/generated/prisma';

export interface CourseFilters {
  query?: string;
  categoryName?: string;
  level?: CourseLevel;
  minPrice?: string;
  maxPrice?: string;
  authorId?: string;
  notEnrolledByUserId?: string;
}

export type CourseSortingOrder = { [key in keyof Course]?: Prisma.SortOrder };

export const courseSummarySelect = {
  id: true,
  title: true,
  previewImageKey: true,
  briefDescription: true,
  duration: true,
  price: true,
  avgRating: true,
  level: true,
  categoryName: true,
  _count: { select: { reviews: true } },
} satisfies Prisma.CourseSelect;

export type CourseSummary = Prisma.CourseGetPayload<{ select: typeof courseSummarySelect }>;

export const courseDetailSelect = {
  id: true,
  stripeProductId: true,
  title: true,
  previewImageKey: true,
  briefDescription: true,
  description: true,
  duration: true,
  price: true,
  stripePriceId: true,
  avgRating: true,
  level: true,
  categoryName: true,
  chapters: {
    select: {
      id: true,
      title: true,
      lessons: { select: { id: true, title: true }, orderBy: { position: 'asc' } },
      _count: { select: { lessons: true } },
    },
    orderBy: { position: 'asc' },
  },
  _count: { select: { reviews: true, chapters: true } },
} satisfies Prisma.CourseSelect;

export type CourseDetail = Prisma.CourseGetPayload<{ select: typeof courseDetailSelect }>;

export const getUserCourseDetailSelect = (userId: string) => {
  return {
    id: true,
    stripeProductId: true,
    title: true,
    previewImageKey: true,
    briefDescription: true,
    description: true,
    duration: true,
    price: true,
    stripePriceId: true,
    avgRating: true,
    level: true,
    categoryName: true,
    chapters: {
      select: {
        id: true,
        title: true,
        lessons: {
          select: {
            id: true,
            title: true,
            userProgresses: { where: { userId }, select: { isCompleted: true } },
          },
          orderBy: { position: 'asc' },
        },
        _count: { select: { lessons: true } },
      },
      orderBy: { position: 'asc' },
    },
    _count: { select: { reviews: true, chapters: true } },
  } satisfies Prisma.CourseSelect;
};

export type UserCourseDetail = Prisma.CourseGetPayload<{
  select: ReturnType<typeof getUserCourseDetailSelect>;
}>;

export interface ReviewFilters {
  userId?: string;
  courseId?: string;
}

export type ReviewSortingOrder = { [key in keyof Review]?: Prisma.SortOrder };

export const reviewSummarySelect = {
  id: true,
  title: true,
  description: true,
  rating: true,
  createdAt: true,
  user: {
    select: { id: true, name: true, image: true },
  },
  course: { select: { id: true, title: true, previewImageKey: true } },
} satisfies Prisma.ReviewSelect;

export type ReviewSummary = Prisma.ReviewGetPayload<{ select: typeof reviewSummarySelect }>;
