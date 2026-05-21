import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: {
    default: 'PopMerry Foods — Banana Cakes & Croissants',
    template: '%s — PopMerry Foods',
  },
  description:
    'Handcrafted banana cakes and artisan croissants baked fresh daily in Lagos. Order online for fast delivery to your door.',
  keywords: ['banana cake', 'croissant', 'bakery', 'fresh baked', 'Lagos', 'Nigeria', 'delivery'],
  openGraph: {
    title: 'PopMerry Foods — Banana Cakes & Croissants',
    description: 'Handcrafted banana cakes and artisan croissants baked fresh daily. Order now.',
    type: 'website',
    siteName: 'PopMerry Foods',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PopMerry Foods',
    description: 'Handcrafted banana cakes and artisan croissants, baked fresh daily.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-amber-50 text-stone-900 antialiased">
        <Header />
        <CartDrawer />
        <main>{children}</main>
        <Footer />
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1c1917',
              color: '#fef3c7',
              borderRadius: '14px',
              padding: '12px 16px',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#f59e0b', secondary: '#1c1917' },
            },
          }}
        />
      </body>
    </html>
  );
}
