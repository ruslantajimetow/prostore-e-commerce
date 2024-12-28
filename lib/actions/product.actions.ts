'use server';
import { prisma } from '@/db/prisma';
import { prismaToPlain } from '../utils';

export async function getProducts() {
  const data = await prisma.product.findMany({
    take: 4,
    orderBy: {
      createdAt: 'desc',
    },
  });
  return prismaToPlain(data);
}
