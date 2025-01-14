'use server';

import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { formatError } from '../utils';
import { auth } from '@/auth';
import { getMyCart } from './cart.actions';
import { CartItem, Order } from '@/types';
import { getUserById } from './user.actions';
import { insertOrderSceham } from '../validators';
import { prisma } from '@/db/prisma';

// Create order and orderitem

export async function createOrder() {
  try {
    const session = await auth();

    if (!session) throw new Error('User is not authenticated');

    const cart = await getMyCart();
    const userId = session.user?.id;
    if (!userId) throw new Error('No User Id found');

    const user = await getUserById(userId);
    if (!cart || cart.items.length === 0) {
      return {
        success: false,
        message: 'Your Cart is Empty',
        redirectTo: '/cart',
      };
    }
    if (!user.address) {
      return {
        success: false,
        message: 'Your Address is empty',
        redirectTo: '/shipping-address',
      };
    }
    if (!user.paymantMethod) {
      return {
        success: false,
        message: 'You need to have at least one payment method',
        redirectTo: '/payment-method',
      };
    }

    const order = insertOrderSceham.parse({
      userId: user.id,
      shippingAddress: user.address,
      paymentMethod: user.paymantMethod,
      itemsPrice: cart.itemsPrice,
      taxPrice: cart.taxPrice,
      shippingPrice: cart.shippingPrice,
      totalPrice: cart.totalPrice,
    });

    const insertedOrderId = await prisma.$transaction(async (tx) => {
      const insertedOrder = await tx.order.create({
        data: order,
      });

      for (const item of cart.items as CartItem[]) {
        await tx.orderItem.create({
          data: { ...item, price: item.price, orderId: insertedOrder.id },
        });
      }

      await tx.cart.update({
        where: { id: cart.id },
        data: {
          items: [],
          itemsPrice: 0,
          totalPrice: 0,
          taxPrice: 0,
          shippingPrice: 0,
        },
      });

      return insertedOrder.id;
    });

    if (!insertedOrderId) throw new Error('Order not created');

    return {
      success: true,
      message: 'Order Created',
      redirectTo: `/order/${insertedOrderId}`,
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export const getOrderById = async (id: string) => {
  const data = await prisma.order.findFirst({
    where: { id },
    include: {
      orderitems: true,
      user: { select: { name: true, email: true } },
    },
  });

  return JSON.parse(JSON.stringify(data)) as Order;
};
