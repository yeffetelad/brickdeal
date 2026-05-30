"use client";

import { useCollection, type SavedSet } from "@/hooks/useCollection";

export default function CollectionButton({ set }: { set: SavedSet }) {
  const { isSaved, add, remove } = useCollection();
  const saved = isSaved(set.set_num);

  return (
    <button
      onClick={() => (saved ? remove(set.set_num) : add(set))}
      className={`w-full py-3 rounded-xl font-semibold transition text-sm ${
        saved
          ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
          : "bg-yellow-400 hover:bg-yellow-300 text-black"
      }`}
    >
      {saved ? "✓ In your collection — Remove" : "+ Add to my collection"}
    </button>
  );
}
