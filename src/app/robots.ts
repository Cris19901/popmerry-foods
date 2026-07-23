import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // /quote/* are private, per-customer capability URLs
        disallow: ['/admin', '/api/', '/quote/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
