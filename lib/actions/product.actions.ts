'use server';
import { prisma } from '@/db/prisma';
import { PAGE_SIZE } from '../constants';
import { formatError } from '../utils';
import { revalidatePath } from 'next/cache';

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

// Get all products for admin
export async function getAllProducts({
  page,
  query,
  category,
  limit = PAGE_SIZE,
}: {
  page: number;
  query: string;
  category: string;
  limit?: number;
}) {
  const data = await prisma.product.findMany({
    skip: (page - 1) * limit,
    take: limit,
  });

  if (!data) throw new Error('Products not found');

  const dataCount = await prisma.product.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

//delete products for admin
export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({ where: { id } });

    revalidatePath('/admin/products');

    return {
      success: true,
      message: 'Product removed successfully from the store',
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
