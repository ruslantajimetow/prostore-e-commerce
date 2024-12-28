'use server';

import { PrismaClient } from '@prisma/client';
import { prismaToPlain } from '../utils';
const prisma = new PrismaClient();

export async function getProducts() {
  const data = await prisma.product.findMany({
    take: 4,
    orderBy: {
      createdAt: 'desc',
    },
  });
  return prismaToPlain(data);
}
