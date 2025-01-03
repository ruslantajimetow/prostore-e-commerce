'use server';
import { prisma } from '@/db/prisma';

// Get all products from DB
export async function getProducts() {
  const data = await prisma.product.findMany({
    take: 4,
    orderBy: {
      createdAt: 'desc',
    },
  });
  return JSON.parse(JSON.stringify(data));
}

// Get a product by its slug
export async function getProductByslug(slug: string) {
  return await prisma.product.findFirst({
    where: { slug: slug },
  });
}
