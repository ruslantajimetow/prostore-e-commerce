import { auth } from '@/auth';
import { getMyCart } from '@/lib/actions/cart.actions';
import { getUserById } from '@/lib/actions/user.actions';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import ShippingAddressForm from './shipping-address-form';
import { ShippingAddress } from '@/types';

export const metadata: Metadata = {
  title: 'Shipping address',
};

export default async function ShippinPage() {
  const cart = await getMyCart();
  if (!cart || cart.items.length === 0) redirect('/');

  const session = await auth();

  const userId = session?.user?.id;

  if (!userId) {
    redirect('/sign-in');
  }

  const user = await getUserById(userId);

  return (
    <>
      <ShippingAddressForm address={user.address as ShippingAddress} />
    </>
  );
}
