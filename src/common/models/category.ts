import { z } from 'zod';
import { slugSchema } from './base';

export type Category = z.infer<typeof CategorySchema>;
export type CreateCategoryDto = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryDto = z.infer<typeof UpdateCategorySchema>;

const nameSchema = z
  .string()
  .trim()
  .transform((val) => val.trim().replace(/\s+/g, ' '))
  .refine((val) => val.length > 0, {
    message: 'Name is required',
  });

export const CategorySchema = z.object({
  name: nameSchema,
  slug: slugSchema,
});

export const CreateCategorySchema = z.object({
  name: nameSchema,
  slug: slugSchema,
});

export const UpdateCategorySchema = z.object({
  name: nameSchema,
});
