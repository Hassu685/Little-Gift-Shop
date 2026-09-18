import { Playfair_Display, Great_Vibes, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["500", "600", "700"],
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  variable: "--font-great-vibes",
  weight: "400",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: {
    default: "Little Gift Shop | Small Gifts, Big Smiles",
    template: "%s | Little Gift Shop",
  },
  description:
    "Handmade, premium gifts for birthdays, anniversaries, weddings and every moment worth celebrating.",
};

// This is the single root layout for the whole app (customer site + admin).
// It only sets up <html>/<body> and fonts. Chrome (navbar/footer/providers
// for the storefront, sidebar/topbar for the dashboard) lives in the
// nested layouts at app/(site)/layout.js and app/admin/layout.js — Next.js
// only allows one root layout per app, so this stays intentionally bare.
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${greatVibes.variable} ${inter.variable} font-body antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
