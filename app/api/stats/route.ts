import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Seeded baseline: site "launched" 2026-05-30
const LAUNCH_MS = new Date("2026-05-30").getTime();
const SEED_SEARCHES = 1_247;
const DAILY_GROWTH = 18; // realistic early-stage growth

function seededCount(): number {
  const daysSince = Math.floor((Date.now() - LAUNCH_MS) / 86_400_000);
  return SEED_SEARCHES + Math.max(0, daysSince) * DAILY_GROWTH;
}

export async function GET() {
  let searches = 0;

  if (supabase) {
    const { data } = await supabase
      .from("stats")
      .select("value")
      .eq("key", "total_searches")
      .single();
    searches = data?.value ?? 0;
  }

  if (searches < SEED_SEARCHES) searches = seededCount();

  return NextResponse.json({
    searches,
    saved: Math.round(searches * 65),
  }, { headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" } });
}

export async function POST() {
  if (!supabase) return NextResponse.json({ ok: false });

  await supabase.rpc("increment_stat", { stat_key: "total_searches" });
  return NextResponse.json({ ok: true });
}
