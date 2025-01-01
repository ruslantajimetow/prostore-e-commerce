import * as z from 'zod';
import { formatPrice } from './utils';

const currency = z
  .string()
  .refine((val) => /^\d+(\.\d{2})?$/.test(formatPrice(Number(val))));

export const insertProductSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Name must be at least 3 characters long' }),
  slug: z
    .string()
    .min(3, { message: 'Slug must be at least 3 characters long' }),
  description: z
    .string()
    .min(3, { message: 'Description must be at least 3 characters long' }),
  images: z
    .array(z.string())
    .min(1, { message: 'At least one image is required' }),
  category: z
    .string()
    .min(3, { message: 'Category must be at least 3 characters long' }),
  price: currency,
  brand: z.string(),
  stock: z.coerce.number(),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
});

export const signInFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});
