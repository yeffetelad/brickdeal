"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCollection } from "@/hooks/useCollection";
import Logo from "@/components/Logo";

export default function NavBar() {
  const { collection } = useCollection();
  const pathname = usePathname();
  const isHome = pathname === "/";

  const brand = (
    <span className="flex items-center gap-2 font-black text-white tracking-tight">
      <Logo size={24} />
      <span>Brick<span className="text-yellow-400">Deal</span></span>
    </span>
  );

  return (
    <nav className="border-b border-gray-800/60 bg-[#0a0a0a]/90 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
        {isHome ? brand : <Link href="/" className="hover:opacity-80 transition">{brand}</Link>}
        <Link href="/collection" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition">
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
