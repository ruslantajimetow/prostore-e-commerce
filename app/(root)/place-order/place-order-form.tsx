'use client';

import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { createOrder } from '@/lib/actions/order.actions';
import { Check, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PlaceOrderForm() {
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await createOrder();

    if (res.redirectTo) {
      router.push(res.redirectTo);
    }
  };

  const PlaceOrderButton = () => {
    const { pending } = useFormStatus();

    return (
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Check className="w-4 h-4" />
        )}{' '}
        Place Order
      </Button>
    );
  };

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <PlaceOrderButton />
    </form>
  );
}
