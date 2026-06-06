import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';

const THEME_ICONS: Record<string, string> = {
  'Star Wars': '⚔️',
  'Technic': '⚙️',
  'Icons': '🏛️',
  'Architecture': '🌆',
  'Ideas': '💡',
  'Modular': '🏙️',
};

const THEME_ORDER = ['Star Wars', 'Technic', 'Icons', 'Modular', 'Architecture', 'Ideas'];

async function fetchSetDetails(set_num: string) {
  const key = process.env.REBRICKABLE_API_KEY;
  try {
    const res = await fetch(
      `https://rebrickable.com/api/v3/lego/sets/${set_num}/`,
      { headers: { Authorization: `key ${key}` }, next: { revalidate: 86400 } }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function CategoriesPage() {
  const { data: clones } = supabase
    ? await supabase.from('clones').select('set_num, theme')
    : { data: [] };

  if (!clones?.length) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <p className="text-zinc-500">No categories found.</p>
      </main>
    );
  }

  // Group set_nums by theme (deduplicated)
  const byTheme: Record<string, string[]> = {};
  for (const clone of clones) {
    const theme = clone.theme || 'Other';
    if (!byTheme[theme]) byTheme[theme] = [];
    if (!byTheme[theme].includes(clone.set_num)) {
      byTheme[theme].push(clone.set_num);
    }
  }

  // Fetch all set details in parallel
  const allSetNums = [...new Set(clones.map((c: { set_num: string }) => c.set_num))];
  const details = await Promise.all(allSetNums.map(fetchSetDetails));
  const setMap: Record<string, { name: string; num_parts: number; set_img_url: string | null; year: number }> = {};
  allSetNums.forEach((s, i) => { if (details[i]) setMap[s] = details[i]; });

  const themes = THEME_ORDER.filter(t => byTheme[t]);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-black mb-1">Browse by Category</h1>
        <p className="text-zinc-500 mb-10 text-sm">Click any set to find clone alternatives on AliExpress</p>

        {/* Category anchor chips */}
        <div className="flex flex-wrap gap-2 mb-12">
          {themes.map(theme => (
            <a key={theme} href={`#${theme.replace(' ', '-')}`}
              className="px-4 py-2 rounded-full bg-zinc-800 hover:bg-yellow-400 hover:text-black transition-colors text-sm font-medium cursor-pointer">
              {THEME_ICONS[theme] || '📦'} {theme}
            </a>
          ))}
        </div>

        {/* Category sections */}
        {themes.map(theme => (
          <section key={theme} id={theme.replace(' ', '-')} className="mb-16 scroll-mt-20">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">{THEME_ICONS[theme] || '📦'}</span>
              <h2 className="text-xl font-bold">{theme}</h2>
              <span className="text-sm text-zinc-600">({byTheme[theme].length} sets)</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {byTheme[theme].map(set_num => {
                const set = setMap[set_num];
                if (!set) return null;
                return (
                  <Link key={set_num} href={`/set/${set_num}`}
                    className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-yellow-400/50 transition-all group hover:-translate-y-0.5">
                    <div className="aspect-video bg-zinc-800 overflow-hidden">
                      {set.set_img_url ? (
                        <Image src={set.set_img_url} alt={set.name}
                          width={240} height={135}
                          className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform"
                          unoptimized />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl">🧱</div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-yellow-400/60 font-mono mb-1">{set_num}</p>
                      <p className="text-sm font-semibold leading-tight line-clamp-2 text-white group-hover:text-yellow-100 transition">{set.name}</p>
                      <p className="text-xs text-zinc-600 mt-1.5">{set.num_parts?.toLocaleString()} pcs · {set.year}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}

        <p className="text-xs text-zinc-700 text-center mt-4">
          Set images © The LEGO Group, via Rebrickable
        </p>
      </div>
    </main>
  );
}
