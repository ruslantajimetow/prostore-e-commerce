import ProductList from '@/components/shared/product/product-list';
import { getProducts } from '@/lib/actions/product.actions';
import { Product } from '@/types';

export default async function HomePage() {
  const latestdata: Product[] = await getProducts();
  return <ProductList data={latestdata} title="Newest Arrivals" />;
}
