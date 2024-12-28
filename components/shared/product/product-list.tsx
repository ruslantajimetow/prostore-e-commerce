'use client';

import ProductCard from './product-card';

export default function ProductList({
  data,
  title,
  limit,
}: {
  data: any;
  title?: string;
  limit?: number;
}) {
  const limitedData = limit ? data.slice(0, limit) : data;
  return (
    <div className="my-10">
      <h2 className="h2-bold mb-4">{title}</h2>
      {data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {limitedData.map((product: any, i: number) => {
            return <ProductCard product={product} key={i} />;
          })}
        </div>
      ) : (
        <div>
          <p>No product found</p>
        </div>
      )}
    </div>
  );
}
