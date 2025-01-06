'use client';

import { Cart, CartItem } from '@/types';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Plus, Minus, Loader } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { addItemToCart, removeCartItem } from '@/lib/actions/cart.actions';
import { useTransition } from 'react';

export default function AddTocart({
  cart,
  item,
}: {
  cart?: Cart;
  item: CartItem;
}) {
  const router = useRouter();
  const { toast } = useToast();

  const [isPending, startTransition] = useTransition();

  const handleAddToCart = async () => {
    startTransition(async () => {
      const res = await addItemToCart(item);

      if (!res.success) {
        toast({
          variant: 'destructive',
          description: res.message,
          duration: 3000,
        });
        return;
      }

      //handle Success add to cart

      toast({
        description: res.message,
        action: (
          <ToastAction
            className="bg-secondary  hover:bg-primary"
            altText="Go to Cart"
            onClick={() => router.push('/cart')}
          >
            Go to Cart
          </ToastAction>
        ),
        duration: 5000,
      });
    });
  };

  const existItem =
    cart && cart.items.find((x) => x.productId === item.productId);

  const handleRemoveCart = async () => {
    startTransition(async () => {
      const res = await removeCartItem(item.productId);
      toast({
        variant: res.success ? 'default' : 'destructive',
        description: res.message,
        duration: 3000,
      });
    });
  };

  return existItem ? (
    <div>
      <Button type="button" variant="outline" onClick={handleRemoveCart}>
        {isPending ? (
          <Loader className="h-4 w-4 animate-spin" />
        ) : (
          <Minus className="h-4 w-4" />
        )}
      </Button>
      <span className="px-2">{existItem.qty}</span>
      <Button type="button" variant="outline" onClick={handleAddToCart}>
        {isPending ? (
          <Loader className="h-4 w-4 animate-spin" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
      </Button>
    </div>
  ) : (
    <Button
      variant="default"
      className="w-full"
      type="button"
      onClick={handleAddToCart}
    >
      {isPending ? (
        <Loader className="h-4 w-4 animate-spin" />
      ) : (
        <Plus className="h-4 w-4" />
      )}
      Add To Cart
    </Button>
  );
}
