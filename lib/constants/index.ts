export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Prostore';
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  'Prostore is a simple e-commerce platform created with Next.js and Prisma';
export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
export const PAYMENT_METHODS = process.env.PYAMENT_METHODS
  ? process.env.PAYMENT_METHODS?.split(', ')
  : ['PayPal', 'Stripe', 'CashOnDelivery'];
export const DEFAULT_PAYMENT_METHOD =
  process.env.DEFAULT_PAYMENT_METHOD || 'PayPal';

export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 12;

export const PRODUCT_DEFAULT_VALUES = {
  name: 'Test Product',
  slug: '',
  category: 'Cloths',
  images: [],
  brand: 'Polo',
  description: 'Test Description',
  price: '20',
  stock: 5,
  rating: 0,
  numReviews: '0',
  isFeatured: false,
  banner: null,
};
