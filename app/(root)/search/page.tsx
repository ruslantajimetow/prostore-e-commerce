import ProductCard from '@/components/shared/product/product-card';
import {
  getAllCategories,
  getAllProducts,
} from '@/lib/actions/product.actions';
import { Product } from '@/types';
import React from 'react';
import FilterLinks from './filter-links';

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

  const getFilterUrl = ({
    c,
    query,
    p,
    s,
    r,
    pg,
  }: {
    c?: string;
    query?: string;
    p?: string;
    s?: string;
    r?: string;
    pg?: string;
  }) => {
    const params = { category, q, page, sort, rating, price };

    if (c) params.category = c;
    if (query) params.q = query;
    if (p) params.price = p;
    if (s) params.sort = s;
    if (r) params.rating = r;
    if (pg) params.page = pg;

    return `/search?${new URLSearchParams(params).toString()}`;
  };

  const allCategories = await getAllCategories();

  return (
    <div className="grid md:grid-cols-5 gap-5">
      <FilterLinks
        allCategories={allCategories}
        linksFn={getFilterUrl}
        category={category}
        price={price}
        rating={rating}
      />
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
