"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCollection } from "@/hooks/useCollection";

export default function NavBar() {
  const { collection } = useCollection();
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <nav className="border-b border-gray-800/60 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
        {isHome ? (
          <span className="font-black text-white tracking-tight">🧱 Ali vs LEGO</span>
        ) : (
          <Link href="/" className="font-black text-white tracking-tight hover:text-yellow-400 transition">
            🧱 Ali vs LEGO
          </Link>
        )}
        <Link
          href="/collection"
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition"
        >
          My Collection
          {collection.length > 0 && (
            <span className="bg-yellow-400 text-black text-xs font-black px-2 py-0.5 rounded-full min-w-[20px] text-center">
              {collection.length}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}
