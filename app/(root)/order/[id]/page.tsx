import { Metadata } from 'next';
import { getOrderById } from '@/lib/actions/order.actions';
import { notFound } from 'next/navigation';
import OrderDetails from './order-details';
import { auth } from '@/auth';

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

  return (
    <>
      <OrderDetails
        order={order}
        paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
        isAdmin={session.user.role === 'admin' || false}
      />
    </>
  );
}
