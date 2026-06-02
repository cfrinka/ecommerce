import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Navbar } from "./components/Navbar";
import { CartProvider } from "./components/CartContext";
import { initDb } from "./lib/db";
import { getLocale } from "./lib/server-locale";

const naughtyMonster = localFont({
  src: "../public/assets/NaughtyMonster.otf",
  variable: "--font-naughty",
  display: "swap",
});

const poiretOne = localFont({
  src: "../public/assets/PoiretOne-Regular.ttf",
  variable: "--font-poiret",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BENE - Premium T-Shirts",
  description: "Premium t-shirts for everyday wear. Shop the collection.",
};

initDb();

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  return (
    <html
      lang={locale}
      className={`${naughtyMonster.variable} ${poiretOne.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#f5f3f0] text-[#282828] font-sans">
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
