import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
import CookieBanner from "@/components/ui/CookieBanner";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="pt-16">{children}</main>
      <Footer />
      <CookieBanner />
    </>
  );
}
