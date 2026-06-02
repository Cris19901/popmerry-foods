import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import WhatsAppButton from '@/components/WhatsAppButton';
import CookieBanner from '@/components/CookieBanner';
import SocialProof from '@/components/SocialProof';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <CartDrawer />
      <main>{children}</main>
      <Footer />
      <WhatsAppButton />
      <SocialProof />
      <CookieBanner />
    </>
  );
}
