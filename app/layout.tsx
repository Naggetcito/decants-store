import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CartToast } from "@/components/cart/CartToast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

// La itálica solo aparece bajo el pliegue: sin preload para no competir con la foto del hero.
const playfairItalic = Playfair_Display({
  subsets: ["latin"],
  style: "italic",
  variable: "--font-playfair-italic",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: "Decants Store | Perfumes de diseñador en 5ml y 10ml",
    template: "%s | Decants Store",
  },
  description:
    "Decants originales de perfumes de diseñador en 5ml y 10ml. Prueba las fragancias que te gustan sin pagar la botella completa y pide por WhatsApp.",
  openGraph: {
    type: "website",
    locale: "es_PE",
    siteName: "Decants Store",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0B",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${playfair.variable} ${playfairItalic.variable}`}
    >
      <body>
        <Providers>
          <Navbar />
          {children}
          <Footer />
          <WhatsAppFloat />
          <CartDrawer />
          <CartToast />
        </Providers>
      </body>
    </html>
  );
}
