import { createClient } from "@supabase/supabase-js";

export type Clone = {
  id: number;
  set_num: string;
  brand: string;
  model_num: string | null;
  quality_rating: number;
  ali_url: string;
  notes: string | null;
};

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_ANON_KEY;

export const supabase = url && key ? createClient(url, key) : null;
