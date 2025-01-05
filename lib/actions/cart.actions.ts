'use server';

import { CartItem } from '@/types';
import { formatError } from '../utils';
import { cookies } from 'next/headers';
import { auth } from '@/auth';
import { prisma } from '@/db/prisma';
import { cartItemSchema } from '../validators';

export const addItemToCart = async (data: CartItem) => {
  try {
    //check for the cart cookie
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if (!sessionCartId) throw new Error('Cart session not found');
    // get session and use id
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    const cart = await getMyCart();

    //Parse and validate item

    const item = cartItemSchema.parse(data);

    //Find Product in db

    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    });

    console.log({
      'Session id': sessionCartId,
      userId: userId,
      ItemRequested: item,
      'product found': product,
    });

    return {
      success: true,
      message: `Item added to cart`,
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
};

export const getMyCart = async () => {
  // sessionCartId
  const sessionCartId = (await cookies()).get('sessionCartId')?.value;
  if (!sessionCartId) throw new Error('Cart session not found');
  // get session and use id
  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  //get  user cart from database

  const cart = await prisma.cart.findFirst({
    where: userId ? { userId } : { sessionCartId },
  });

  if (!cart) return undefined;

  return JSON.parse(
    JSON.stringify({
      ...cart,
      items: cart.items,
      itemsPrice: cart.itemsPrice.toString(),
      totalPrice: cart.totalPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
    })
  );
};
