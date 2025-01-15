'use server';

import { Cart, CartItem } from '@/types';
import { formatError, round2 } from '../utils';
import { cookies } from 'next/headers';
import { auth } from '@/auth';
import { prisma } from '@/db/prisma';
import { cartItemSchema, insertCartSchema } from '../validators';
import { revalidatePath } from 'next/cache';

const calcPrices = (items: CartItem[]) => {
  const itemsPrice = round2(
      items.reduce((acc, cur) => acc + Number(cur.price) * cur.qty, 0)
    ),
    shippingPrice = round2(itemsPrice > 100 ? 0 : 10),
    taxPrice = round2(0.15 * itemsPrice),
    totalPrice = round2(itemsPrice + shippingPrice + taxPrice);
  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

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

    if (!product) throw new Error('Product not found!');

    if (!cart) {
      const newCart = insertCartSchema.parse({
        userId,
        sessionCartId,
        items: [item],
        ...calcPrices([item]),
      });
      await prisma.cart.create({ data: newCart });

      revalidatePath(`/product/${product.slug}`);
      return {
        success: true,
        message: `${product.name} added to cart`,
      };
    } else {
      const existingItem = (cart.items as CartItem[]).find(
        (x) => x.productId === item.productId
      );
      if (existingItem) {
        if (product.stock < existingItem.qty + 1) {
          throw new Error('Not enough stock!');
        }
        existingItem.qty += 1;
      } else {
        if (product.stock < 1) throw new Error('Not enough stock!');

        cart.items = [...cart.items, item];
      }

      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items as CartItem[],
          ...calcPrices(cart.items as CartItem[]),
        },
      });

      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message: `${product.name} ${
          existingItem ? 'updated in' : 'added to'
        } cart`,
      };
    }
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

  const myCart = JSON.parse(
    JSON.stringify({
      ...cart,
      items: cart.items,
      itemsPrice: cart.itemsPrice.toString(),
      totalPrice: cart.totalPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
    })
  );

  return myCart as Cart;
};

// Remove cart item functionality
export const removeCartItem = async (productId: string) => {
  try {
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if (!sessionCartId) throw new Error('Cart session not found');

    // Get the product
    const product = await prisma.product.findFirst({
      where: { id: productId },
    });
    if (!product) throw new Error('Product not found');

    //get the cart
    const cart = await getMyCart();
    if (!cart) throw new Error('Cart nor found');

    const exist = (cart.items as CartItem[]).find(
      (x) => x.productId === productId
    );
    if (!exist) throw new Error('Item not found');

    if (exist.qty === 1) {
      cart.items = (cart.items as CartItem[]).filter(
        (x) => x.productId !== exist.productId
      );
    } else {
      exist.qty -= 1;
    }

    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: cart.items as CartItem[],
        ...calcPrices(cart.items as CartItem[]),
      },
    });

    revalidatePath(`/product/${product.slug}`);

    return {
      success: true,
      message: `${product.name} successfully removed from cart`,
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
};
