import { Metadata } from 'next';
import { getOrderById } from '@/lib/actions/order.actions';
import { notFound } from 'next/navigation';
import OrderDetails from './order-details';
import { auth } from '@/auth';
import Stripe from 'stripe';

export const metadata: Metadata = {
  title: 'Order',
};

export default async function OrderPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  const order = await getOrderById(id);

  if (!order) notFound();

  const session = await auth();

  if (!session) throw new Error('User not Found');

  let client_secret = null;

  if (order.paymentMethod === 'Stripe' && !order.isPaid) {
    //init stripe instance
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
    //create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(order.totalPrice) * 100),
      currency: 'USD',
      metadata: { orderId: order.id },
    });
    client_secret = paymentIntent.client_secret;
  }

  return (
    <>
      <OrderDetails
        order={order}
        paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
        isAdmin={session.user.role === 'admin' || false}
        stripeClientSecret={client_secret}
      />
    </>
  );
}
