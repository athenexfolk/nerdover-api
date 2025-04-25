import { z } from 'zod';
import { slugRule } from '../utils/rule';

export const slugSchema = z
  .string()
  .trim()
  .min(1, 'Slug is required')
  .regex(slugRule, 'Invalid slug');
