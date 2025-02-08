import AddTocart from '@/components/shared/product/add-to-cart';
import ProductImages from '@/components/shared/product/product-images';
import ProductPrice from '@/components/shared/product/product-price';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { getProductByslug } from '@/lib/actions/product.actions';
import { notFound } from 'next/navigation';
import { getMyCart } from '@/lib/actions/cart.actions';
import Reviewlist from './review-list';
import { auth } from '@/auth';
import Rating from '@/components/shared/product/rating';

export default async function ProductDetail(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = (await props.params) as { slug: string };
  const product = await getProductByslug(slug);
  if (!product) notFound();
  const session = await auth();
  const userId = session?.user.id;
  const cart = await getMyCart();
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
            <Rating value={Number(product.rating)} />
            <p>
              {product?.numReviews > 1
                ? `${product.numReviews} reviews`
                : `${product.numReviews} review`}{' '}
            </p>
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
                  {product.stock > 0 && (
                    <AddTocart
                      cart={cart}
                      item={{
                        productId: product.id,
                        name: product.name,
                        slug: product.slug,
                        qty: 1,
                        image: product.images![0],
                        price: product.price,
                      }}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section className="mt-10">
        <h2 className="h2-bold">Customer reviews</h2>
        <Reviewlist
          userId={userId || ''}
          productId={product.id}
          productSlug={product.slug}
        />
      </section>
    </>
  );
}
