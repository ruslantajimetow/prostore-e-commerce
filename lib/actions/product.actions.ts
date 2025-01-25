'use server';
import { prisma } from '@/db/prisma';
import { PAGE_SIZE } from '../constants';
import { formatError } from '../utils';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { insertProductSchema, updateProductSchema } from '../validators';

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
    query,
    category,
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

//Create product for admin
export async function createProduct(data: z.infer<typeof insertProductSchema>) {
  try {
    const product = insertProductSchema.parse(data);

    await prisma.product.create({
      data: product,
    });

    revalidatePath('/admin/products');

    return {
      success: true,
      message: 'Product created successfully!',
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
//Update product for admin
export async function updateProduct(data: z.infer<typeof updateProductSchema>) {
  try {
    const product = updateProductSchema.parse(data);

    const existingProduct = await prisma.product.findFirst({
      where: { id: product.id },
    });

    if (!existingProduct) throw new Error('Product not found');

    await prisma.product.update({ where: { id: product.id }, data: product });

    revalidatePath('/admin/products');

    return {
      success: true,
      message: 'Product updated successfully!',
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
