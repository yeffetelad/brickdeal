"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type LegoSet = {
  set_num: string;
  name: string;
  year: number;
  num_parts: number;
  set_img_url: string | null;
};

const QUICK_SEARCHES = [
  { label: "Millennium Falcon", query: "75192" },
  { label: "Bugatti Chiron", query: "42083" },
  { label: "Titanic", query: "10294" },
  { label: "Optimus Prime", query: "10302" },
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LegoSet[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function doSearch(q: string) {
    if (!q.trim()) return;
    setQuery(q);
    setLoading(true);
    setSearched(true);
    const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    setResults(data.results ?? []);
    setLoading(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    doSearch(query);
  }

  return (
    <div className="flex-1 flex flex-col">
      {!searched ? (
        /* ── HERO ── */
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
          {/* Warm glow behind heading */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-yellow-400/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-center max-w-lg w-full">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 border border-yellow-400/30 bg-yellow-400/5 rounded-full px-4 py-1.5 mb-8 text-yellow-400 text-sm font-medium">
              🧱 Find clones. Save up to 90%.
            </div>

            {/* Heading */}
            <h1 className="text-6xl sm:text-7xl font-black tracking-tight leading-none mb-4">
              <span className="text-white">Ali</span>
              <span className="text-yellow-400"> vs </span>
              <span className="text-white">LEGO</span>
            </h1>
            <p className="text-gray-400 text-base mb-10 max-w-sm leading-relaxed">
              Search any LEGO set — see if a quality clone exists on AliExpress or Temu for a fraction of the price.
            </p>

            {/* Search box */}
            <form onSubmit={handleSubmit} className="w-full flex gap-2 mb-6">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Set name or number…"
                autoFocus
                className="flex-1 bg-gray-900 border border-gray-700 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 rounded-2xl px-5 py-4 text-white placeholder-gray-600 outline-none transition text-base"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-yellow-400 hover:bg-yellow-300 active:scale-95 text-black font-bold px-7 py-4 rounded-2xl transition-all text-base disabled:opacity-50 whitespace-nowrap"
              >
                Search
              </button>
            </form>

            {/* Quick chips */}
            <div className="flex gap-2 flex-wrap justify-center">
              {QUICK_SEARCHES.map((s) => (
                <button
                  key={s.query}
                  onClick={() => doSearch(s.query)}
                  className="text-xs text-gray-400 hover:text-yellow-400 border border-gray-800 hover:border-yellow-400/40 bg-gray-900 hover:bg-yellow-400/5 rounded-full px-3.5 py-1.5 transition"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* ── RESULTS ── */
        <div className="max-w-3xl mx-auto w-full px-4 py-8">
          {/* Inline search bar */}
          <form onSubmit={handleSubmit} className="flex gap-2 mb-8">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search sets…"
              className="flex-1 bg-gray-900 border border-gray-700 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-5 py-3 rounded-xl transition disabled:opacity-50"
            >
              {loading ? "…" : "Search"}
            </button>
          </form>

          {/* Skeleton */}
          {loading && (
            <div className="grid sm:grid-cols-2 gap-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-900 rounded-2xl p-4 flex gap-4 animate-pulse">
                  <div className="w-20 h-20 bg-gray-800 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-2.5 py-1">
                    <div className="h-2.5 bg-gray-800 rounded w-1/4" />
                    <div className="h-4 bg-gray-800 rounded w-3/4" />
                    <div className="h-2.5 bg-gray-800 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && results.length === 0 && (
            <div className="text-center py-24">
              <p className="text-5xl mb-4">🔍</p>
              <p className="text-gray-400">No sets found for &ldquo;{query}&rdquo;</p>
            </div>
          )}

          {/* Grid results */}
          {!loading && results.length > 0 && (
            <>
              <p className="text-xs text-gray-600 mb-4 uppercase tracking-widest">
                {results.length} results
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {results.map((set) => (
                  <Link
                    key={set.set_num}
                    href={`/set/${set.set_num}`}
                    className="card-hover group flex gap-4 bg-gray-900 border border-gray-800 hover:border-yellow-400/30 rounded-2xl p-4 items-center"
                  >
                    {/* Image */}
                    <div className="w-20 h-20 flex-shrink-0 bg-gray-800 rounded-xl overflow-hidden">
                      {set.set_img_url ? (
                        <Image
                          src={set.set_img_url}
                          alt={set.name}
                          width={80}
                          height={80}
                          className="object-contain w-full h-full p-1"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">🧱</div>
                      )}
                    </div>
                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <p className="text-yellow-400/70 font-mono text-xs mb-0.5">{set.set_num}</p>
                      <p className="font-semibold text-white group-hover:text-yellow-100 transition text-sm leading-snug line-clamp-2">
                        {set.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {set.year}
                        {set.num_parts > 0 && ` · ${set.num_parts.toLocaleString()} pcs`}
                      </p>
                    </div>
                    <span className="text-gray-700 group-hover:text-yellow-400 transition flex-shrink-0 text-xl">›</span>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
