import { z } from 'zod';

export type User = z.infer<typeof UserSchema>;

export const UserSchema = z.object({
  email: z.string(),
  name: z.string(),
});
