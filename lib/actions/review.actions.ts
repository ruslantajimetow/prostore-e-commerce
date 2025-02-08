'use server';

import { z } from 'zod';
import { insertReviewSchema } from '../validators';
import { formatError } from '../utils';
import { auth } from '@/auth';
import { prisma } from '@/db/prisma';
import { revalidatePath } from 'next/cache';

export const createUpdateReview = async (
  data: z.infer<typeof insertReviewSchema>
) => {
  try {
    const session = await auth();

    if (!session) throw new Error('Unauthorized');

    //validate and store the review

    const review = insertReviewSchema.parse({
      ...data,
      userId: session.user.id,
    });

    //get product that the review is for

    const product = await prisma.product.findFirst({
      where: { id: review.productId },
    });

    if (!product) throw new Error('Product not found');

    //Check if user already reviewed the product

    const existingReview = await prisma.review.findFirst({
      where: {
        userId: review.userId,
        productId: review.productId,
      },
    });

    await prisma.$transaction(async (tx) => {
      if (existingReview) {
        await tx.review.update({
          where: { id: existingReview.id },
          data: {
            title: review.title,
            description: review.description,
            rating: review.rating,
          },
        });
      } else {
        await tx.review.create({
          data: review,
        });
      }

      //Get the avg rating of the product
      const averageRating = await tx.review.aggregate({
        _avg: { rating: true },
        where: { productId: review.productId },
      });

      //Get the number of reviews for the product
      const numReviews = await tx.review.count({
        where: { productId: review.productId },
      });

      //Update the product with the new rating and number of reviews
      await tx.product.update({
        where: { id: review.productId },
        data: {
          rating: averageRating._avg.rating || 0,
          numReviews,
        },
      });
    });

    revalidatePath(`/product/${product.slug}`);

    return { success: true, message: 'Review submitted' };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};

//Get all reviews for a product
export const getReviews = async (productId: string) => {
  const reviews = await prisma.review.findMany({
    where: {
      productId,
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return { reviews };
};

// get a review for a specific user
export const getReviewForUser = async (productId: string) => {
  const session = await auth();
  if (!session) {
    throw new Error('Unauthorized');
  }

  return await prisma.review.findFirst({
    where: {
      productId,
      userId: session.user.id,
    },
  });
};
