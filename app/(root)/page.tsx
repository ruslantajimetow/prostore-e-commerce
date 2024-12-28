import ProductList from '@/components/shared/product/product-list';
import { getProducts } from '@/lib/actions/product.actions';

export default async function HomePage() {
  const latestdata = await getProducts();
  return <ProductList data={latestdata} title="Newest Arrivals" />;
}
