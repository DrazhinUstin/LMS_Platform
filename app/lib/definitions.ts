import type { CourseLevel, Prisma } from '@/generated/prisma';

export interface CourseFilters {
  query?: string;
  categoryName?: string;
  level?: CourseLevel;
  minPrice?: string;
  maxPrice?: string;
  authorId?: string;
  notEnrolledByUserId?: string;
}

export enum CourseSortingOrder {
  CREATED_DESC = 'Newest first',
  CREATED_ASC = 'Oldest first',
  PRICE_DESC = 'Most expensive first',
  PRICE_ASC = 'Less expensive first',
  RATING_DESC = 'Top rated first',
  RATING_ASC = 'Low rated first',
}

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

export const lessonDetailSelect = {
  id: true,
  title: true,
  description: true,
  posterKey: true,
  videoKey: true,
  position: true,
  chapterId: true,
} satisfies Prisma.LessonSelect;

export type LessonDetail = Prisma.LessonGetPayload<{ select: typeof lessonDetailSelect }>;

export const getUserLessonDetailSelect = (userId: string) => {
  return {
    ...lessonDetailSelect,
    userProgresses: { where: { userId }, select: { isCompleted: true } },
  } satisfies Prisma.LessonSelect;
};

export type UserLessonDetail = Prisma.LessonGetPayload<{
  select: ReturnType<typeof getUserLessonDetailSelect>;
}>;

export interface ReviewFilters {
  userId?: string;
  courseId?: string;
  courseAuthorId?: string;
}

export enum ReviewSortingOrder {
  CREATED_DESC = 'Newest first',
  CREATED_ASC = 'Oldest first',
  RATING_DESC = 'Top rated first',
  RATING_ASC = 'Low rated first',
}

export const reviewSummarySelect = {
  id: true,
  title: true,
  description: true,
  rating: true,
  createdAt: true,
  user: {
    select: { id: true, name: true, email: true, image: true },
  },
  course: { select: { id: true, title: true, previewImageKey: true } },
} satisfies Prisma.ReviewSelect;

export type ReviewSummary = Prisma.ReviewGetPayload<{ select: typeof reviewSummarySelect }>;
