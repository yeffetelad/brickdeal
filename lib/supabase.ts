import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Clone = {
  id: number;
  set_num: string;
  brand: string;
  model_num: string | null;
  quality_rating: number;
  ali_url: string;
  notes: string | null;
};
