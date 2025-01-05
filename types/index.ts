import {
  cartItemSchema,
  insertCartSchema,
  insertProductSchema,
} from '@/lib/validators';
import * as z from 'zod';

export type Product = z.infer<typeof insertProductSchema> & {
  id: string;
  rating: number;
  createdAt: Date;
};

export type CartItem = z.infer<typeof cartItemSchema>;

export type Cart = z.infer<typeof insertCartSchema>;
