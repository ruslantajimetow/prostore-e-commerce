import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shopping Cart',
};

import CartItems from './cart-items';
import { getMyCart } from '@/lib/actions/cart.actions';

export default async function CartPage() {
  const cart = await getMyCart();
  return (
    <>
      <CartItems cart={cart} />
    </>
  );
}
