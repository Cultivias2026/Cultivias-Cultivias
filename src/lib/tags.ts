import { getCollection } from 'astro:content';
import { TAGS, MIN_ARTICLES, knownTags } from '../data/tags';

/** Indeksabilni članci (kao u sitemapu): bez noindexa i bez tuđeg canonicala. */
export async function indexableArticles() {
  const all = await getCollection('articles');
  return all.filter(a => {
    if (a.data.noindex) return false;
    const own = `/${a.data.category}/${a.slug}/`;
    return !(a.data.canonicalUrl && a.data.canonicalUrl !== own);
  });
}

/** Oznaka -> članci (novije prvo). Samo oznake iz popisa TAGS. */
export async function articlesByTag() {
  const arts = (await indexableArticles()).sort(
    (a, b) => new Date(b.data.publishedAt).getTime() - new Date(a.data.publishedAt).getTime(),
  );
  const map = new Map<string, typeof arts>();
  for (const a of arts) {
    for (const t of knownTags(a.data.tags)) {
      if (!map.has(t)) map.set(t, []);
      map.get(t)!.push(a);
    }
  }
  return map;
}

/** Oznake koje imaju vlastitu stranicu (barem MIN_ARTICLES članaka). */
export async function publishedTags() {
  const map = await articlesByTag();
  return [...map.entries()]
    .filter(([, arts]) => arts.length >= MIN_ARTICLES)
    .map(([key, arts]) => ({ key, def: TAGS[key], articles: arts }));
}

/** Hrvatski oblik: 1 članak, 2–4 članka, 5+ članaka (21 članak, 22 članka…). */
export function clanciLabel(n: number): string {
  const d = n % 10, h = n % 100;
  if (d === 1 && h !== 11) return 'članak';
  if (d >= 2 && d <= 4 && (h < 12 || h > 14)) return 'članka';
  return 'članaka';
}
