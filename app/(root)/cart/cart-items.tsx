'use client';

import { Cart, CartItem } from '@/types';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { addItemToCart, removeCartItem } from '@/lib/actions/cart.actions';
import { ArrowRight, Plus, Minus, Loader } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  TableHeader,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

export default function CartItems({ cart }: { cart?: Cart }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  return (
    <>
      <h1 className="py-4 h2-bold">Shopping Cart</h1>
      {!cart || cart.items.length === 0 ? (
        <div className="flex flex-col items-center">
          Cart is Empty.{' '}
          <Button asChild className="mt-3">
            <Link href={`/`}>Go to Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-4">
          <div className="overflow-x-auto md:col-span-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.items.map((item: CartItem) => {
                  return (
                    <TableRow key={item.slug}>
                      <TableCell>
                        <Link
                          href={`product/${item.slug}`}
                          className="flex items-center "
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                          />
                          <span className="hidden sm:inline-block ml-2">
                            {item.name}
                          </span>
                        </Link>
                      </TableCell>
                      <TableCell className="flex lg:flex-row md:flex-col-reverse items-center gap-2 justify-center">
                        <Button
                          disabled={isPending}
                          variant="outline"
                          onClick={() =>
                            startTransition(async () => {
                              const res = await removeCartItem(item.productId);

                              toast({
                                variant: res.success
                                  ? 'default'
                                  : 'destructive',
                                description: res.message,
                                duration: 3000,
                              });
                            })
                          }
                        >
                          {isPending ? (
                            <Loader className="w-4 h-4 animate-spin" />
                          ) : (
                            <Minus className="w-4 h-4" />
                          )}
                        </Button>
                        <span className="px-2">{item.qty}</span>
                        <Button
                          disabled={isPending}
                          variant="outline"
                          onClick={() =>
                            startTransition(async () => {
                              const res = await addItemToCart(item);

                              toast({
                                variant: res.success
                                  ? 'default'
                                  : 'destructive',
                                description: res.message,
                                duration: 3000,
                              });
                            })
                          }
                        >
                          {isPending ? (
                            <Loader className="w-4 h-4 animate-spin" />
                          ) : (
                            <Plus className="w-4 h-4" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell align="right">
                        <span className="font-bold">{item.price}$</span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <Card className="max-h-40">
            <CardContent className="p-4 gap-4">
              <div className="flex lg:flex-row md:flex-col justify-between mb-4">
                <span className="text-lg">
                  Subtotal {cart.items.reduce((a, c) => a + c.qty, 0)}:
                </span>
                <span className="font-bold">
                  {formatCurrency(cart.itemsPrice)}
                </span>
              </div>

              <Button
                className="w-full"
                onClick={() =>
                  startTransition(() => router.push('/shipping-address'))
                }
              >
                {!isPending ? (
                  <ArrowRight className="w-4 h-4" />
                ) : (
                  <Loader className="w-4 h-4 animate-spin" />
                )}{' '}
                Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
