import { getCollection } from 'astro:content';
import { TAGS, knownTags, minArticles } from '../data/tags';

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

/** Oznake koje imaju vlastitu stranicu (vidi minArticles). */
export async function publishedTags() {
  const map = await articlesByTag();
  return [...map.entries()]
    .filter(([key, arts]) => arts.length >= minArticles(key))
    .map(([key, arts]) => ({ key, def: TAGS[key], articles: arts }));
}

/** Hrvatski oblik: 1 članak, 2–4 članka, 5+ članaka (21 članak, 22 članka…). */
export function clanciLabel(n: number): string {
  const d = n % 10, h = n % 100;
  if (d === 1 && h !== 11) return 'članak';
  if (d >= 2 && d <= 4 && (h < 12 || h > 14)) return 'članka';
  return 'članaka';
}

import { tagPath as _tagPath, tagLabel as _tagLabel } from '../data/tags';

export const CAT_LABELS: Record<string, string> = { voce: 'Voće', povrce: 'Povrće', bilje: 'Bilje', vijesti: 'Vijesti' };

type Art = { slug: string; data: { category: string; tags?: string[] } };

/** data-* atributi kartice za filtar na stranici. */
export function itemAttrs(a: Art) {
  const k = knownTags(a.data.tags);
  return {
    'data-item': '',
    'data-biljka': k.filter(t => TAGS[t].group === 'biljka').join(' '),
    'data-tema': k.filter(t => TAGS[t].group === 'tema').join(' '),
    'data-kat': a.data.category,
  };
}

/** Opcije filtra (biljka / tema / kategorija) za zadani popis članaka. */
export function buildFacets(
  articles: Art[],
  opts: { base: string; publishedKeys: Set<string>; biljka?: boolean; tema?: boolean; kat?: boolean; minBiljka?: number },
) {
  const count = (pick: (a: Art) => string[]) => {
    const m = new Map<string, number>();
    for (const a of articles) for (const v of pick(a)) m.set(v, (m.get(v) ?? 0) + 1);
    return [...m.entries()].sort((x, y) => y[1] - x[1] || x[0].localeCompare(y[0], 'hr'));
  };
  const facets: { key: 'biljka' | 'tema' | 'kat'; title: string; options: { value: string; label: string; count: number; href: string }[] }[] = [];
  if (opts.biljka) {
    const opt = count(a => knownTags(a.data.tags).filter(t => TAGS[t].group === 'biljka' && opts.publishedKeys.has(t)))
      .filter(([, n]) => n >= (opts.minBiljka ?? 1))
      .map(([k, n]) => ({ value: k, label: _tagLabel(k), count: n, href: `${opts.base}${_tagPath(k).slice(1)}` }));
    facets.push({ key: 'biljka', title: 'Biljka', options: opt });
  }
  if (opts.tema) {
    const opt = count(a => knownTags(a.data.tags).filter(t => TAGS[t].group === 'tema'))
      .map(([k, n]) => ({ value: k, label: _tagLabel(k), count: n, href: `?tema=${k}` }));
    facets.push({ key: 'tema', title: 'Tema', options: opt });
  }
  if (opts.kat) {
    const opt = count(a => [a.data.category])
      .map(([k, n]) => ({ value: k, label: CAT_LABELS[k] ?? k, count: n, href: `${opts.base}${k}/` }));
    facets.push({ key: 'kat', title: 'Kategorija', options: opt });
  }
  return facets;
}
