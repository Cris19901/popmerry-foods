import { Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import WhatsAppButton from '@/components/WhatsAppButton';
import CookieBanner from '@/components/CookieBanner';
import SocialProof from '@/components/SocialProof';
import RefCapture from '@/components/RefCapture';
import MobileBottomNav from '@/components/MobileBottomNav';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <RefCapture />
      </Suspense>
      {/* Extra bottom padding on mobile so content clears the fixed bottom nav */}
      <div className="pb-14 lg:pb-0">
        <Header />
        <CartDrawer />
        <main>{children}</main>
        <Footer />
      </div>
      <WhatsAppButton />
      <SocialProof />
      <CookieBanner />
      <MobileBottomNav />
    </>
  );
}
