import { z } from 'zod';
import { slugSchema } from './base';

export type Lesson = z.infer<typeof LessonSchema>;
export type CreateLessonDto = z.infer<typeof CreateLessonSchema>;
export type UpdateLessonDto = z.infer<typeof UpdateLessonSchema>;

const titleSchema = z
  .string()
  .trim()
  .transform((val) => val.trim().replace(/\s+/g, ' '))
  .refine((val) => val.length > 0, {
    message: 'Title is required',
  });

export const LessonSchema = z.object({
  title: titleSchema,
  slug: slugSchema,
  categorySlug: slugSchema,
  categoryName: titleSchema,
  cover: z.string().optional(),
  contentPath: z.string(),
});

export const CreateLessonSchema = z.object({
  title: titleSchema,
  slug: slugSchema,
  categorySlug: slugSchema,
  cover: z.string().optional(),
});

export const UpdateLessonSchema = z
  .object({
    title: titleSchema,
    cover: z.string(),
  })
  .partial();

export const GetLessonRequestSchema = z.object({
  params: z.object({ slug: slugSchema }),
});

export const CreateLessonRequestSchema = z.object({
  body: CreateLessonSchema,
});
