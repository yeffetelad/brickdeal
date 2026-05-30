import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NavBar from "@/components/NavBar";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BrickDeal — Find compatible brick set alternatives",
  description: "Search any LEGO® set and find quality compatible alternatives on AliExpress and Temu for a fraction of the price.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0a0a0a]">
        <NavBar />
        {children}
        <footer className="border-t border-gray-800/60 mt-auto py-6 px-4 text-center">
          <p className="text-xs text-gray-600 max-w-2xl mx-auto leading-relaxed">
            BrickDeal is not affiliated with, endorsed by, or associated with The LEGO Group.
            LEGO® is a registered trademark of The LEGO Group. Set images sourced via Rebrickable
            for product identification only. Compatible sets listed are independent third-party
            brands (Mould King, Cada, Xingbao, etc.) and are not LEGO® products.
          </p>
        </footer>
      </body>
    </html>
  );
}
