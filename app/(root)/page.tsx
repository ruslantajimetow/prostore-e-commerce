import ProductCarousel from '@/components/shared/product/product-carousel';
import ProductList from '@/components/shared/product/product-list';
import ViewAllProductsButton from '@/components/view-all-products-button';
import {
  getFeaturedProducts,
  getProducts,
} from '@/lib/actions/product.actions';
import { Product } from '@/types';

export default async function HomePage() {
  const latestdata: Product[] = await getProducts();
  const featuredproducts: Product[] = await getFeaturedProducts();
  return (
    <>
      {featuredproducts.length > 0 && (
        <ProductCarousel data={featuredproducts} />
      )}
      <ProductList data={latestdata} title="Newest Arrivals" />
      <ViewAllProductsButton />
    </>
  );
}
