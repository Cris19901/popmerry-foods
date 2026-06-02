import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Menu',
  description: 'Browse our full menu of handcrafted banana cakes and artisan croissants. Fresh daily, delivered to your door.',
  openGraph: {
    title: 'Our Menu — PopMerry Foods',
    description: 'Banana cakes, croissants, and bundles. All made fresh every morning.',
  },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
