import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase, type Clone } from "@/lib/supabase";
import { withAffiliate } from "@/lib/affiliateUrl";
import CollectionButton from "@/components/CollectionButton";

type LegoSet = {
  set_num: string;
  name: string;
  year: number;
  theme_id: number;
  num_parts: number;
  set_img_url: string | null;
  set_url: string;
};

type Theme = { id: number; parent_id: number | null; name: string };

async function fetchSet(setNum: string): Promise<LegoSet | null> {
  const res = await fetch(
    `https://rebrickable.com/api/v3/lego/sets/${setNum}/`,
    { headers: { Authorization: `key ${process.env.REBRICKABLE_API_KEY}` }, next: { revalidate: 3600 } }
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Rebrickable error");
  return res.json();
}

async function fetchTheme(themeId: number): Promise<Theme | null> {
  const res = await fetch(
    `https://rebrickable.com/api/v3/lego/themes/${themeId}/`,
    { headers: { Authorization: `key ${process.env.REBRICKABLE_API_KEY}` }, next: { revalidate: 86400 } }
  );
  if (!res.ok) return null;
  return res.json();
}

async function fetchClones(setNum: string): Promise<Clone[]> {
  if (!supabase) return [];
  const { data } = await supabase
    .from("clones")
    .select("*")
    .eq("set_num", setNum)
    .order("quality_rating", { ascending: false });
  return data ?? [];
}

function temuSearchUrl(setName: string) {
  const term = `${setName} building blocks`;
  return `https://www.temu.com/search_result.html?search_key=${encodeURIComponent(term)}&sort_type=3`;
}

function Stars({ rating }: { rating: number }) {
  return (
    <span>
      <span className="text-yellow-400">{"★".repeat(rating)}</span>
      <span className="text-gray-600">{"★".repeat(5 - rating)}</span>
    </span>
  );
}

export default async function SetPage({
  params,
}: {
  params: Promise<{ set_num: string }>;
}) {
  const { set_num } = await params;

  let set = await fetchSet(set_num);
  const resolvedNum = set ? set_num : `${set_num}-1`;
  if (!set) set = await fetchSet(resolvedNum);
  if (!set) notFound();

  const [theme, clones] = await Promise.all([
    fetchTheme(set.theme_id),
    fetchClones(set.set_num),
  ]);

  const setNumShort = set.set_num.replace(/-\d+$/, "");
  const bricklinkUrl = `https://www.bricklink.com/v2/catalog/catalogitem.page?S=${set.set_num}#T=P`;
  const legoUrl = `https://www.lego.com/en-us/search?q=${setNumShort}`;

  const genericTerm = `building blocks ${set.name}`;
  const aliFallbackUrl = withAffiliate(
    `https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(genericTerm)}&sortType=total_tranpro_desc&FilterMinRating=4`
  );
  const temuFallbackUrl = temuSearchUrl(set.name);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <Link href="/" className="text-sm text-gray-400 hover:text-white mb-6 inline-block">
          ← Back to search
        </Link>

        {/* Header */}
        <div className="relative rounded-2xl overflow-hidden mb-8 bg-gray-900 border border-gray-800">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 via-transparent to-transparent pointer-events-none" />
          <div className="relative flex gap-5 p-5 items-center">
            <div className="w-28 h-28 flex-shrink-0 bg-gray-800 rounded-xl overflow-hidden ring-1 ring-white/5">
              {set.set_img_url ? (
                <Image src={set.set_img_url} alt={set.name} width={112} height={112}
                  className="object-contain w-full h-full p-2" unoptimized />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl">🧱</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-yellow-400/70 font-mono text-xs mb-1">{set.set_num}</p>
              <h1 className="text-xl sm:text-2xl font-black leading-tight mb-2 text-white">{set.name}</h1>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-gray-800 text-gray-300 px-2.5 py-1 rounded-full">{set.year}</span>
                <span className="text-xs bg-gray-800 text-gray-300 px-2.5 py-1 rounded-full">{set.num_parts.toLocaleString()} pcs</span>
                {theme && <span className="text-xs bg-gray-800 text-gray-300 px-2.5 py-1 rounded-full">{theme.name}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Collection */}
        <div className="mb-8">
          <CollectionButton set={{
            set_num: set.set_num, name: set.name,
            year: set.year, num_parts: set.num_parts, set_img_url: set.set_img_url,
          }} />
        </div>

        {/* Prices */}
        {set.num_parts > 0 && (() => {
          const retail = Math.round(set.num_parts * 0.10 / 5) * 5;
          const clone  = Math.round(set.num_parts * 0.025 / 5) * 5;
          const saving = retail - clone;
          const pct    = Math.round((saving / retail) * 100);
          return (
            <section className="mb-8">
              <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-3">Price Comparison</h2>
              {/* Summary bar */}
              <div className="bg-gray-800 rounded-xl p-4 mb-3 flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-xs text-gray-400 mb-1">LEGO® retail (est.)</p>
                  <p className="text-2xl font-black text-white">${retail}</p>
                </div>
                <div className="text-gray-600 text-2xl">→</div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400 mb-1">Compatible clone (est.)</p>
                  <p className="text-2xl font-black text-green-400">${clone}</p>
                </div>
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg px-3 py-2 text-center flex-shrink-0">
                  <p className="text-green-400 font-black text-lg">-{pct}%</p>
                  <p className="text-green-500/70 text-xs">save ~${saving}</p>
                </div>
              </div>
              {/* External links */}
              <div className="grid grid-cols-2 gap-3">
                <a href={legoUrl} target="_blank" rel="noopener noreferrer"
                  className="bg-gray-800 rounded-xl p-3 hover:bg-gray-700 transition block">
                  <p className="text-xs text-gray-400 mb-1">Official LEGO®</p>
                  <p className="text-sm font-semibold">LEGO.com ↗</p>
                </a>
                <a href={bricklinkUrl} target="_blank" rel="noopener noreferrer"
                  className="bg-gray-800 rounded-xl p-3 hover:bg-gray-700 transition block">
                  <p className="text-xs text-gray-400 mb-1">Used (Bricklink)</p>
                  <p className="text-sm font-semibold">Price Guide ↗</p>
                </a>
              </div>
              <p className="text-xs text-gray-700 mt-2 text-center">Prices estimated (~$0.10/piece for LEGO®)</p>
            </section>
          );
        })()}

        {/* Clones */}
        <section className="mb-8">
          <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-3">Compatible Alternatives</h2>
          {clones.length === 0 ? (
            <div className="bg-gray-800 rounded-xl p-6 text-center text-gray-500 text-sm">
              No compatible alternatives found for this set yet
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {clones.map((clone) => (
                <div key={clone.id} className="bg-gray-800 rounded-xl p-4">
                  <div className="mb-3">
                    <p className="font-semibold text-white">
                      {clone.brand}
                      {clone.model_num && (
                        <span className="text-gray-400 font-mono font-normal text-sm ml-2">
                          {clone.model_num}
                        </span>
                      )}
                    </p>
                    {clone.notes && (
                      <p className="text-xs text-gray-400 mt-0.5">{clone.notes}</p>
                    )}
                    <div className="mt-1"><Stars rating={clone.quality_rating} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <a href={withAffiliate(clone.ali_url)} target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="flex items-center justify-center gap-1.5 bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold py-2.5 rounded-lg transition">
                      🛍 AliExpress
                    </a>
                    <a href={temuSearchUrl(set.name)} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 bg-[#e02020] hover:bg-[#c51010] text-white text-sm font-semibold py-2.5 rounded-lg transition">
                      🔴 Temu
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Fallback */}
        <div className="border-t border-gray-800 pt-6">
          <p className="text-xs text-gray-500 mb-3 text-center">Search both platforms directly</p>
          <div className="grid grid-cols-2 gap-3">
            <a href={aliFallbackUrl} target="_blank" rel="noopener noreferrer sponsored"
              className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 rounded-xl transition text-sm">
              🛍 AliExpress
            </a>
            <a href={temuFallbackUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 rounded-xl transition text-sm">
              🔴 Temu
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
