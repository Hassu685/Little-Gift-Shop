import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import { AuthProvider } from "@/hooks/useAuth";
import { CartProvider } from "@/hooks/useCart";
import { WishlistProvider } from "@/hooks/useWishlist";

export const metadata = {
  title: "Little Gift Shop | Small Gifts, Big Smiles",
  description:
    "Handmade, premium gifts for birthdays, anniversaries, weddings and every moment worth celebrating. Thoughtfully made, beautifully delivered.",
  openGraph: {
    title: "Little Gift Shop",
    description: "Thoughtful gifts for every moment.",
    type: "website",
  },
};

export default function SiteLayout({ children }) {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <AnnouncementBar />
          <Navbar />
          <main>{children}</main>
          <Footer />
          <BackToTop />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
