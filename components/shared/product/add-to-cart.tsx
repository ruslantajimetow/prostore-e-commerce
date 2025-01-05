'use client';

import { CartItem } from '@/types';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { addItemToCart } from '@/lib/actions/cart.actions';

export default function AddTocart({ item }: { item: CartItem }) {
  const router = useRouter();
  const { toast } = useToast();
  const handleAddToCart = async () => {
    const res = await addItemToCart(item);

    if (!res.success) {
      toast({
        variant: 'destructive',
        description: res.message,
      });
      return;
    }
    //handle Success add to cart

    toast({
      description: `${item.name} added to cart`,
      action: (
        <ToastAction
          className="bg-secondary  hover:bg-primary"
          altText="Go to Cart"
          onClick={() => router.push('/cart')}
        >
          Go to Cart
        </ToastAction>
      ),
    });
  };
  return (
    <Button
      variant="default"
      className="w-full"
      type="button"
      onClick={handleAddToCart}
    >
      <Plus />
      Add To Cart
    </Button>
  );
}
