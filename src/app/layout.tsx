import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Housespark – Villas de groupe tout inclus",
  description:
    "Réservez des villas d'exception pour vos événements de groupe. Jusqu'à 45 personnes, activités, extras, sans tracas.",
  icons: {
    icon: '/images/Favicon%20Housepark.svg',
    shortcut: '/images/Favicon%20Housepark.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.className} antialiased bg-white overflow-x-hidden`}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
