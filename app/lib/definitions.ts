import type { CourseLevel, CourseStatus, Prisma } from '@/generated/prisma';

export enum UserSortingOrder {
  NAME_DESC = 'By name (z to a)',
  NAME_ASC = 'By name (a to z)',
}

export const getCustomerSelect = (courseAuthorId: string) =>
  ({
    id: true,
    name: true,
    email: true,
    image: true,
    enrollments: {
      where: { course: { authorId: courseAuthorId }, status: 'ACTIVE' },
      select: { amount: true },
    },
  }) satisfies Prisma.UserSelect;

export type Customer = Prisma.UserGetPayload<{
  select: ReturnType<typeof getCustomerSelect>;
}>;

export interface CourseFilters {
  query?: string;
  categoryName?: string;
  avgRating?: string;
  level?: CourseLevel;
  status?: CourseStatus;
  minPrice?: string;
  maxPrice?: string;
  authorId?: string;
  notEnrolledByUserId?: string;
}

export enum CourseSortingOrder {
  CREATED_DESC = 'Newest first',
  CREATED_ASC = 'Oldest first',
  POPULARITY_DESC = 'Most popular first',
  POPULARITY_ASC = 'Less popular first',
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
  status: true,
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
  status: true,
  categoryName: true,
  updatedAt: true,
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
    ...courseDetailSelect,
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

export interface EnrollmentFilters {
  courseAuthorId?: string;
}

export enum EnrollmentSortingOrder {
  CREATED_DESC = 'Newest first',
  CREATED_ASC = 'Oldest first',
}

export const enrollmentSummarySelect = {
  amount: true,
  status: true,
  createdAt: true,
  course: {
    select: {
      id: true,
      title: true,
      previewImageKey: true,
      briefDescription: true,
      categoryName: true,
      duration: true,
      level: true,
    },
  },
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  },
} satisfies Prisma.EnrollmentSelect;

export type EnrollmentSummary = Prisma.EnrollmentGetPayload<{
  select: typeof enrollmentSummarySelect;
}>;

export const getUserEnrollmentSummarySelect = (userId: string) => {
  return {
    amount: true,
    status: true,
    createdAt: true,
    course: {
      select: {
        id: true,
        title: true,
        previewImageKey: true,
        briefDescription: true,
        categoryName: true,
        duration: true,
        level: true,
        chapters: {
          select: {
            id: true,
            lessons: {
              select: {
                id: true,
                userProgresses: { where: { userId }, select: { isCompleted: true } },
              },
              orderBy: { position: 'asc' },
            },
            _count: { select: { lessons: true } },
          },
          orderBy: { position: 'asc' },
        },
      },
    },
  } satisfies Prisma.EnrollmentSelect;
};

export type UserEnrollmentSummary = Prisma.EnrollmentGetPayload<{
  select: ReturnType<typeof getUserEnrollmentSummarySelect>;
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

export interface ArticleFilters {
  query?: string;
  categoryName?: string;
  minReadingTime?: string;
  maxReadingTime?: string;
  status?: CourseStatus;
  authorId?: string;
}

export enum ArticleSortingOrder {
  CREATED_DESC = 'Newest first',
  CREATED_ASC = 'Oldest first',
  LIKES_DESC = 'Most liked first',
  LIKES_ASC = 'Less liked first',
}

export const articleSummarySelect = {
  id: true,
  title: true,
  posterKey: true,
  briefDescription: true,
  readingTime: true,
  status: true,
  categoryName: true,
  createdAt: true,
  _count: { select: { likes: true, comments: true } },
} satisfies Prisma.ArticleSelect;

export type ArticleSummary = Prisma.ArticleGetPayload<{ select: typeof articleSummarySelect }>;

export const articleDetailSelect = {
  ...articleSummarySelect,
  content: true,
  updatedAt: true,
} satisfies Prisma.ArticleSelect;

export type ArticleDetail = Prisma.ArticleGetPayload<{ select: typeof articleDetailSelect }>;

export interface CommentFilters {
  articleId?: string;
  userId?: string;
}

export enum CommentSortingOrder {
  CREATED_DESC = 'Newest first',
  CREATED_ASC = 'Oldest first',
}

export const commentSummarySelect = {
  id: true,
  text: true,
  createdAt: true,
  updatedAt: true,
  user: { select: { id: true, name: true, image: true } },
  article: { select: { id: true, title: true, posterKey: true } },
  parent: {
    select: {
      id: true,
      text: true,
      user: { select: { id: true, name: true, image: true } },
    },
  },
} satisfies Prisma.CommentSelect;

export type CommentSummary = Prisma.CommentGetPayload<{ select: typeof commentSummarySelect }>;
