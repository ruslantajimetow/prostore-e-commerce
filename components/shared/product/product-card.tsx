import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import ProductPrice from './product-price';
import { Product } from '@/types';
import Rating from './rating';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="w-full shadow-lg max-w-sm mx-auto overflow-hidden">
      <CardHeader className="p-0 items-center">
        <Link href={`/product/${product.slug}`}>
          <Image
            src={product.images[0]}
            alt="Product Image"
            height={300}
            width={300}
            priority={true}
          />
        </Link>
      </CardHeader>
      <CardContent className="grid gap-4 p-4">
        <div className="text-xs">{product.brand}</div>
        <Link href={`product/${product.slug}`}>
          <h2 className="text-sm font-medium">{product.name}</h2>
        </Link>
        <div className="flex-between">
          <Rating value={Number(product.rating)} />
          {product.stock > 0 ? (
            <ProductPrice value={+product.price} />
          ) : (
            <p className="text-destructive">Out Of Stock</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
