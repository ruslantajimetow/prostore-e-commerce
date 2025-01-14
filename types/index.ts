import {
  cartItemSchema,
  insertCartSchema,
  insertProductSchema,
  shippingAddressSchema,
  insertOrderItemSchema,
  insertOrderSceham,
} from '@/lib/validators';
import * as z from 'zod';

export type Product = z.infer<typeof insertProductSchema> & {
  id: string;
  rating: number;
  createdAt: Date;
};

export type CartItem = z.infer<typeof cartItemSchema>;

export type Cart = z.infer<typeof insertCartSchema>;

export type ShippingAddress = z.infer<typeof shippingAddressSchema>;

export type OrderItem = z.infer<typeof insertOrderItemSchema>;

export type Order = z.infer<typeof insertOrderSceham> & {
  id: string;
  createdAt: Date;
  isPaidd: Boolean;
  paidAt: Date | null;
  isdelivere: Boolean;
  deliveredAt: Date | null;
  orderitems: OrderItem[];
  user: { name: string; email: string };
};
