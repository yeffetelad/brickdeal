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

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LegoSet[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setResults(data.results ?? []);
    setLoading(false);
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Hero */}
      {!searched && (
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center">
          <div className="mb-6 text-7xl">🧱</div>
          <h1 className="text-5xl font-black text-white mb-3 tracking-tight">
            Ali <span className="text-yellow-400">vs</span> LEGO
          </h1>
          <p className="text-gray-400 text-lg mb-10 max-w-md">
            Find any LEGO set — then see if a quality clone exists on AliExpress for a fraction of the price
          </p>
          <form onSubmit={handleSearch} className="w-full max-w-lg">
            <div className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Set name or number…"
                autoFocus
                className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-base"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-yellow-400 hover:bg-yellow-300 active:scale-95 text-black font-bold px-7 py-4 rounded-xl transition-all disabled:opacity-50 text-base"
              >
                Search
              </button>
            </div>
          </form>
          <div className="mt-8 flex gap-3 flex-wrap justify-center">
            {["75192", "42083", "10294", "42143"].map((num) => (
              <button
                key={num}
                onClick={() => {
                  setQuery(num);
                  setSearched(true);
                  setLoading(true);
                  fetch(`/api/search?q=${num}`)
                    .then((r) => r.json())
                    .then((d) => { setResults(d.results ?? []); setLoading(false); });
                }}
                className="text-xs text-gray-500 hover:text-yellow-400 border border-gray-700 hover:border-yellow-400 rounded-lg px-3 py-1.5 transition"
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results view */}
      {searched && (
        <div className="max-w-3xl mx-auto w-full px-4 py-8">
          {/* Inline search bar */}
          <form onSubmit={handleSearch} className="flex gap-2 mb-8">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search sets…"
              className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-5 py-3 rounded-xl transition disabled:opacity-50"
            >
              {loading ? "…" : "Search"}
            </button>
          </form>

          {loading && (
            <div className="flex flex-col gap-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-gray-800 rounded-2xl p-4 flex gap-4 animate-pulse">
                  <div className="w-16 h-16 bg-gray-700 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-3 bg-gray-700 rounded w-1/4" />
                    <div className="h-4 bg-gray-700 rounded w-3/4" />
                    <div className="h-3 bg-gray-700 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && results.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              <p className="text-4xl mb-4">🔍</p>
              <p>No sets found for &ldquo;{query}&rdquo;</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <>
              <p className="text-xs text-gray-500 mb-4">{results.length} results</p>
              <div className="flex flex-col gap-3">
                {results.map((set) => (
                  <Link
                    key={set.set_num}
                    href={`/set/${set.set_num}`}
                    className="group flex gap-4 bg-gray-800 hover:bg-gray-750 border border-transparent hover:border-yellow-400/30 rounded-2xl p-4 items-center transition-all"
                  >
                    <div className="w-16 h-16 flex-shrink-0 bg-gray-700 rounded-xl overflow-hidden">
                      {set.set_img_url ? (
                        <Image
                          src={set.set_img_url}
                          alt={set.name}
                          width={64}
                          height={64}
                          className="object-contain w-full h-full p-1"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600 text-lg">🧱</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-yellow-400 font-mono text-xs mb-0.5">{set.set_num}</p>
                      <p className="font-semibold text-white group-hover:text-yellow-100 transition truncate">{set.name}</p>
                      <p className="text-sm text-gray-400">
                        {set.year}
                        {set.num_parts > 0 && ` · ${set.num_parts.toLocaleString()} parts`}
                      </p>
                    </div>
                    <span className="text-gray-600 group-hover:text-yellow-400 transition text-lg flex-shrink-0">→</span>
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
