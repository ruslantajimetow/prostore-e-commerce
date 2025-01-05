'use server';

import { CartItem } from '@/types';

export const addItemToCart = async (item: CartItem) => {
  return {
    success: true,
    message: `Item added to cart`,
  };
};
