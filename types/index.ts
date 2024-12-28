import * as z from 'zod';

const Product = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  images: z.array(z.string()),
  category: z.string(),
  price: z.number(),
  brand: z.string(),
  rating: z.number(),
  numReviews: z.number(),
  stock: z.number(),
  isFeatured: z.boolean().default(false),
  banner: z.string().optional().nullable(),
});

export type Product = z.infer<typeof Product>;
