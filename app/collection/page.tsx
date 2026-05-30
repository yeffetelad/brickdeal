"use client";

import Image from "next/image";
import Link from "next/link";
import { useCollection } from "@/hooks/useCollection";

export default function CollectionPage() {
  const { collection, remove } = useCollection();

  const totalParts = collection.reduce((sum, s) => sum + s.num_parts, 0);

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-1">My Collection</h1>
        <p className="text-gray-400 text-sm mb-8">
          {collection.length === 0
            ? "No sets saved yet"
            : `${collection.length} set${collection.length !== 1 ? "s" : ""} · ${totalParts.toLocaleString()} total parts`}
        </p>

        {collection.length === 0 ? (
          <div className="bg-gray-800 rounded-xl p-10 text-center">
            <p className="text-gray-400 mb-4">
              Search for a LEGO set and tap &ldquo;Add to my collection&rdquo;
            </p>
            <Link
              href="/"
              className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-6 py-3 rounded-lg transition inline-block"
            >
              Start searching
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4 mb-10">
              {collection.map((set) => (
                <div
                  key={set.set_num}
                  className="flex gap-4 bg-gray-800 rounded-xl p-4 items-center"
                >
                  <div className="w-16 h-16 flex-shrink-0 bg-gray-700 rounded-lg overflow-hidden">
                    {set.set_img_url ? (
                      <Image
                        src={set.set_img_url}
                        alt={set.name}
                        width={64}
                        height={64}
                        className="object-contain w-full h-full"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                        —
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-yellow-400 font-mono text-xs">{set.set_num}</p>
                    <Link
                      href={`/set/${set.set_num}`}
                      className="font-semibold text-white hover:underline truncate block"
                    >
                      {set.name}
                    </Link>
                    <p className="text-sm text-gray-400">
                      {set.year} · {set.num_parts.toLocaleString()} parts
                    </p>
                  </div>
                  <button
                    onClick={() => remove(set.set_num)}
                    className="text-gray-500 hover:text-red-400 transition text-sm flex-shrink-0"
                    title="Remove from collection"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Stats footer */}
            <div className="bg-gray-800 rounded-xl p-5 grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold text-yellow-400">{collection.length}</p>
                <p className="text-xs text-gray-400 mt-1">Sets</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-yellow-400">
                  {totalParts.toLocaleString()}
                </p>
                <p className="text-xs text-gray-400 mt-1">Total Parts</p>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
