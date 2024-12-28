import ProductList from '@/components/shared/product/product-list';
import { getProducts } from '@/lib/actions/product.actions';

export default async function HomePage() {
  const data = await getProducts();
  return <ProductList data={data} title="Newest Arrivals" />;
}
