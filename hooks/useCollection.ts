"use client";

import { useEffect, useState, useCallback } from "react";

export type SavedSet = {
  set_num: string;
  name: string;
  year: number;
  num_parts: number;
  set_img_url: string | null;
};

const KEY = "ali-vs-lego:collection";

function load(): SavedSet[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function useCollection() {
  const [collection, setCollection] = useState<SavedSet[]>([]);

  useEffect(() => {
    setCollection(load());
  }, []);

  const isSaved = useCallback(
    (set_num: string) => collection.some((s) => s.set_num === set_num),
    [collection]
  );

  const add = useCallback((set: SavedSet) => {
    setCollection((prev) => {
      if (prev.some((s) => s.set_num === set.set_num)) return prev;
      const next = [...prev, set];
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const remove = useCallback((set_num: string) => {
    setCollection((prev) => {
      const next = prev.filter((s) => s.set_num !== set_num);
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { collection, isSaved, add, remove };
}
