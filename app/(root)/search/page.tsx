import ProductCard from '@/components/shared/product/product-card';
import { getAllProducts } from '@/lib/actions/product.actions';
import { Product } from '@/types';
import React from 'react';

export default async function SearchPage(props: {
  searchParams: Promise<{
    category?: string;
    q?: string;
    page?: string;
    sort?: string;
    rating?: string;
    price?: string;
  }>;
}) {
  const {
    category = 'all',
    q = 'all',
    page = '1',
    sort = 'newest',
    rating = 'all',
    price = 'all',
  } = await props.searchParams;

  const products = await getAllProducts({
    page: Number(page),
    query: q,
    category,
    sort,
    rating,
    price,
  });

  return (
    <div className="grid md:grid-cols-5 gap-5">
      <div className="filter-links"></div>
      <div className="md:col-span-4 space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {products.data.length > 0 ? (
            products.data.map((product) => (
              <ProductCard key={product.id} product={product as Product} />
            ))
          ) : (
            <div className="col-span-3 text-center text-muted-foreground text-2xl font-semibold">
              No products found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
