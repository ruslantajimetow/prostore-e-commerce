import ProductImages from '@/components/shared/product/product-images';
import ProductPrice from '@/components/shared/product/product-price';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getProductByslug } from '@/lib/actions/product.actions';
import { Params } from 'next/dist/server/request/params';
import { notFound } from 'next/navigation';

export default async function ProductDetail(props: { params: Params }) {
  const { slug } = (await props.params) as { slug: string };
  const product = await getProductByslug(slug);
  if (!product) notFound();
  return (
    <>
      <section>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="col-span-2">
            <ProductImages images={product.images} />
          </div>
          <div className="col-span-2 flex flex-col gap-6">
            <p>
              {product?.brand} {product?.category}
            </p>
            <h3 className="h3-bold">{product?.name}</h3>
            <p>{product?.rating}</p>
            <p>{product?.numReviews} reviews</p>
            <div className="flex flex-col sm:items-start">
              <ProductPrice
                value={Number(product?.price)}
                className="bg-green-100 p-3 rounded-xl text-green-700"
              />
            </div>
            <div className="flex flex-col gap-3">
              <p className="font-semibold">Description</p>
              <p>{product?.description}</p>
            </div>
          </div>
          <div>
            <Card>
              <CardContent className="p-4">
                <div className="mb-2 flex justify-between">
                  <p>Price</p>
                  <ProductPrice
                    value={Number(product?.price)}
                    className="font-semibold"
                  />
                </div>
                <div className="mb-2 flex justify-between">
                  <p>Stock</p>
                  {product.stock > 0 ? (
                    <Badge variant="outline">In stock</Badge>
                  ) : (
                    <Badge variant="destructive">Out Of Stock</Badge>
                  )}
                </div>
                <div className="flex-center">
                  <Button className="w-full">Add To Cart</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
