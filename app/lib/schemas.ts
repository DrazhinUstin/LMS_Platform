import { CourseLevel, CourseStatus } from '@/generated/prisma';
import z from 'zod';

const requiredString = z.string().refine((str) => !!str.trim().length, { error: 'Required!' });

export const CourseSchema = z.object({
  categoryName: requiredString,
  title: requiredString.max(100, { error: 'The title must not be longer than 100 characters!' }),
  previewImageKey: requiredString,
  briefDescription: requiredString.max(200, {
    error: 'The brief description must not be longer than 200 characters!',
  }),
  description: requiredString,
  duration: z.coerce
    .number<string>()
    .positive({ error: 'Only positive numbers are allowed!' })
    .int({ error: 'Only integers are allowed!' }),
  price: z.coerce
    .number<string>()
    .positive({ error: 'Only positive numbers are allowed!' })
    .refine(
      (number) => {
        const stringVal = number.toString();
        const decimalPart = stringVal.split('.')[1];
        return !decimalPart || decimalPart.length <= 2;
      },
      { error: 'Must be an integer or have no more than 2 decimal places' }
    ),
  level: z.enum(Object.values(CourseLevel)),
  status: z.enum(Object.values(CourseStatus)),
});

export const ChapterSchema = z.object({
  title: requiredString.max(100, { error: 'The title must not be longer than 100 characters!' }),
});

export const LessonSchema = z.object({
  title: requiredString.max(100, { error: 'The title must not be longer than 100 characters!' }),
  description: requiredString.optional(),
  posterKey: requiredString.optional(),
  videoKey: requiredString.optional(),
});
