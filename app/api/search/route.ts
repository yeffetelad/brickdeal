import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q");
  if (!query) return NextResponse.json({ results: [] });

  const res = await fetch(
    `https://rebrickable.com/api/v3/lego/sets/?search=${encodeURIComponent(query)}&page_size=20`,
    { headers: { Authorization: `key ${process.env.REBRICKABLE_API_KEY}` } }
  );

  if (!res.ok) return NextResponse.json({ error: "API error" }, { status: 502 });

  const data = await res.json();

  // Fire-and-forget stats increment
  fetch(`${req.nextUrl.origin}/api/stats`, { method: "POST" }).catch(() => {});

  return NextResponse.json({ results: data.results ?? [] });
}
