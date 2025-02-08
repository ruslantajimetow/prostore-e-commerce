import React from 'react';

export default function StripePayment({
  price,
  orderId,
  stripeClientSecret,
}: {
  price: number;
  orderId: string;
  stripeClientSecret: string;
}) {
  return <div>Stripe Form</div>;
}
