import { getProducts, isProductsTableReady } from '@/lib/products-db';
import ProductsAdminClient from './ProductsAdminClient';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const [products, dbReady] = await Promise.all([getProducts(), isProductsTableReady()]);

  return (
    <div className="p-4 sm:p-8">
      <ProductsAdminClient products={products} dbReady={dbReady} />
    </div>
  );
}
