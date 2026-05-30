import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NavBar from "@/components/NavBar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ali vs LEGO",
  description: "Compare LEGO set prices vs AliExpress clones",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-950">
        <NavBar />
        {children}
        <footer className="border-t border-gray-800/60 mt-auto py-6 px-4 text-center">
          <p className="text-xs text-gray-600 max-w-2xl mx-auto leading-relaxed">
            This site is not affiliated with, endorsed by, or associated with The LEGO Group.
            LEGO® is a trademark of The LEGO Group. Product images are sourced via Rebrickable
            for identification purposes only. Clone products listed are independent third-party
            brands; always verify quality before purchasing.
          </p>
        </footer>
      </body>
    </html>
  );
}
