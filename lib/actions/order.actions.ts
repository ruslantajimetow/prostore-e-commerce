'use server';

import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { formatError } from '../utils';
import { auth } from '@/auth';
import { getMyCart } from './cart.actions';
import { CartItem, Order, PaymentResult } from '@/types';
import { getUserById } from './user.actions';
import { insertOrderSceham } from '../validators';
import { prisma } from '@/db/prisma';
import { paypal } from '../paypal';
import { revalidatePath } from 'next/cache';
import { PAGE_SIZE } from '../constants';
import { Prisma } from '@prisma/client';

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
        data: { ...order, createdAt: new Date() },
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

//creat new paypal order

export async function createPayPalOrder(orderId: string) {
  try {
    //Get order from Db
    const order = await prisma.order.findFirst({
      where: { id: orderId },
    });

    if (order) {
      //create paypal order
      const paypalOrder = await paypal.createOrder(Number(order.totalPrice));

      //update order with paypal order id
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentResult: {
            id: paypalOrder.id,
            email_address: '',
            status: '',
            pricePaid: '',
          },
        },
      });

      return {
        success: true,
        message: 'Item order created Successfully',
        data: paypalOrder.id,
      };
    } else {
      throw new Error('Order not Found');
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

//Approve paypal order and update order to paid

export async function approvePayPalOrder(
  orderId: string,
  data: { orderID: string }
) {
  try {
    //Get order from Db
    const order = await prisma.order.findFirst({
      where: { id: orderId },
    });

    if (!order) throw new Error('Ordr not found');

    const captureData = await paypal.capturePayment(data.orderID);

    if (
      !captureData ||
      captureData.id !== (order.paymentResult as PaymentResult).id ||
      captureData.status !== 'COMPLETED'
    ) {
      throw new Error('Error in PayPal payment');
    }

    //Update order to paid
    await updateOrderToPaid({
      orderId,
      paymentResult: {
        id: captureData.id,
        status: captureData.status,
        email_address: captureData.payer.email_address,
        pricePaid:
          captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value,
      },
    });

    revalidatePath(`/order/${orderId}`);

    return {
      success: true,
      message: 'Your order paid successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

async function updateOrderToPaid({
  orderId,
  paymentResult,
}: {
  orderId: string;
  paymentResult?: PaymentResult;
}) {
  //Get order from Db
  const order = await prisma.order.findFirst({
    where: { id: orderId },
    include: { orderitems: true },
  });

  if (!order) throw new Error('Ordr not found');

  if (order.isPaid) throw new Error('Order is already paid');

  //Transaction to update order and account for product stock

  await prisma.$transaction(async (tx) => {
    // itereate over products and update the stock
    for (const item of order.orderitems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { increment: -item.qty } },
      });
    }

    //Set the order to paid

    await tx.order.update({
      where: { id: orderId },
      data: {
        isPaid: true,
        paidAt: new Date(),
        paymentResult,
      },
    });
  });

  //Get updated order after the transaction

  const updatedOrder = await prisma.order.findFirst({
    where: { id: orderId },
    include: {
      orderitems: true,
      user: { select: { name: true, email: true } },
    },
  });

  if (!updatedOrder) throw new Error('Order not found');

  return updatedOrder;
}

// Get user Orders

export const getUserOrders = async ({
  limit = PAGE_SIZE,
  page,
}: {
  limit?: number;
  page: number;
}) => {
  const session = await auth();

  if (!session) throw new Error('No Session');

  const data = await prisma.order.findMany({
    where: { userId: session.user?.id },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: (page - 1) * limit,
  });

  const dataCount = await prisma.order.count({
    where: { userId: session.user?.id },
  });
  console.log(dataCount);

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
};

type SalesDataType = {
  month: string;
  totalSales: number;
}[];

export async function getOrderSummary() {
  //Get counts for each resource
  const orderCount = await prisma.order.count();
  const productCount = await prisma.product.count();
  const usersCount = await prisma.user.count();

  // Calculate total sales
  const totalSales = await prisma.order.aggregate({
    _sum: { totalPrice: true },
  });

  // Get monthly sales

  const salesDataRaw = await prisma.$queryRaw<
    Array<{ month: string; totalSales: Prisma.Decimal }>
  >`SELECT to_char("createdAt", 'MM/YY') as "month", sum("totalPrice") as "totalSales" FROM "Order" GROUP BY to_char("createdAt", 'MM/YY')`;

  const salesData: SalesDataType = salesDataRaw.map((entry) => ({
    month: entry.month,
    totalSales: Number(entry.totalSales),
  }));

  // get latest sales

  const latestSales = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    take: 6,
    include: { user: { select: { name: true } } },
  });

  return {
    orderCount,
    productCount,
    usersCount,
    totalSales,
    latestSales,
    salesData,
  };
}

// Get All orders

export async function getAllOrders({
  limit = PAGE_SIZE,
  page,
}: {
  limit?: number;
  page: number;
}) {
  const data = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: (page - 1) * limit,
    include: { user: { select: { name: true } } },
  });

  const dataCount = await prisma.order.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

// Delete orders by admin

export async function deleteOrder(id: string) {
  try {
    await prisma.order.delete({ where: { id } });

    revalidatePath('/admin/orders');

    return {
      success: true,
      message: 'Order removed successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
