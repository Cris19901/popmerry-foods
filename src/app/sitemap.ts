import { MetadataRoute } from 'next';
import { getProducts } from '@/lib/products-db';

const BASE_URL = 'https://popmerryfoods.com.ng';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();

  const productUrls = products
    .filter(p => p.isAvailable)
    .map(p => ({
      url: `${BASE_URL}/products/${p.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/products`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/custom-order`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    ...productUrls,
  ];
}
