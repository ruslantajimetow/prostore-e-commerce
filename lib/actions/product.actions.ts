'use server';
import { prisma } from '@/db/prisma';
import { PAGE_SIZE } from '../constants';
import { formatError } from '../utils';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { insertProductSchema, updateProductSchema } from '../validators';
import { Product } from '@/types';
import { Prisma } from '@prisma/client';

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
// Get a product by its ID
export async function getProductById(productId: string) {
  const data = await prisma.product.findFirst({
    where: { id: productId },
  });

  return JSON.parse(JSON.stringify(data)) as Product;
}

// Get all products for admin
export async function getAllProducts({
  page,
  query,
  category,
  limit = PAGE_SIZE,
  sort,
  rating,
  price,
}: {
  page: number;
  query: string;
  category?: string;
  limit?: number;
  sort?: string;
  rating?: string;
  price?: string;
}) {
  const queryFilter: Prisma.ProductWhereInput =
    query && query !== 'all'
      ? {
          name: {
            contains: query,
            mode: 'insensitive',
          } as Prisma.StringFilter,
        }
      : {};
  const categoryFilter: Prisma.ProductWhereInput =
    category && category !== 'all'
      ? {
          category: {
            contains: category,
            mode: 'insensitive',
          } as Prisma.StringFilter,
        }
      : {};
  const priceFilter: Prisma.ProductWhereInput =
    price && price !== 'all'
      ? {
          price: {
            gte: Number(price.split('-')[0]),
            lte: Number(price.split('-')[1]),
          },
        }
      : {};
  const ratingFilter: Prisma.ProductWhereInput =
    rating && rating !== 'all'
      ? {
          rating: {
            gte: Number(rating),
          },
        }
      : {};
  const data = await prisma.product.findMany({
    where: {
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    },
    orderBy:
      sort === 'newest'
        ? { createdAt: 'asc' }
        : sort === 'rating'
        ? { rating: 'desc' }
        : sort === 'lowest'
        ? { price: 'asc' }
        : { price: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
  });

  if (!data) throw new Error('Products not found');

  const dataCount = await prisma.product.count();

  return {
    data: JSON.parse(JSON.stringify(data)) as Product[],
    totalPages: Math.ceil(dataCount / limit),
    sort,
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

// getAllCategories
export async function getAllCategories() {
  const data = await prisma.product.groupBy({
    by: ['category'],
    _count: true,
  });

  return data;
}

//get featured products
export async function getFeaturedProducts() {
  const data = await prisma.product.findMany({
    where: {
      isFeatured: true,
    },
    take: 4,
    orderBy: {
      createdAt: 'desc',
    },
  });

  return JSON.parse(JSON.stringify(data)) as Product[];
}
