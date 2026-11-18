import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

/**
 * XML sitemap.
 *
 * Pravila (Google / sitemaps.org):
 * - <loc> je uvijek kanonski URL na www hostu (isti kao <link rel="canonical">).
 * - Noindex stranice i članci s tuđim canonicalom ne ulaze u sitemap.
 * - <lastmod> je datum zadnje SADRŽAJNE izmjene (nova ili ispravljena informacija,
 *   značajan dio teksta). Uzima se iz frontmattera članka:
 *     updatedAt (ako je postavljen) -> inače publishedAt.
 *   Ispravci tipfelera, interni linkovi i formatiranje NE mijenjaju updatedAt,
 *   pa ne mijenjaju ni lastmod. Datum se nikad ne generira iz vremena builda.
 * - Početna i kategorije imaju lastmod = najnoviji datum članaka koje prikazuju.
 * - <changefreq> i <priority> se izostavljaju (Google ih ignorira).
 */

const SITE = 'https://www.cultivias.com';

const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})/;

/** Normalizira vrijednost u YYYY-MM-DD; vraća undefined ako nije valjan datum ili je u budućnosti. */
function toDate(value: unknown): string | undefined {
  if (!value) return undefined;
  const str = value instanceof Date ? value.toISOString() : String(value);
  const m = str.match(DATE_RE);
  if (!m) return undefined;
  const iso = `${m[1]}-${m[2]}-${m[3]}`;
  const t = Date.parse(`${iso}T00:00:00Z`);
  if (Number.isNaN(t)) return undefined;
  if (new Date(t).toISOString().slice(0, 10) !== iso) return undefined; // npr. 2026-02-31
  const today = new Date().toISOString().slice(0, 10);
  return iso > today ? undefined : iso;
}

function maxDate(dates: Array<string | undefined>): string | undefined {
  const valid = dates.filter((d): d is string => !!d).sort();
  return valid.length ? valid[valid.length - 1] : undefined;
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

type Entry = { path: string; lastmod?: string };

export const GET: APIRoute = async () => {
  const articles = await getCollection('articles');
  const pages = await getCollection('pages');
  const authors = await getCollection('authors');

  const indexable = articles.filter(a => {
    if (a.data.noindex) return false;
    const own = `/${a.data.category}/${a.slug}/`;
    // članak čiji je canonical drugdje ne smije biti u sitemapu
    if (a.data.canonicalUrl && a.data.canonicalUrl !== own) return false;
    return true;
  });

  const articleEntries: Entry[] = indexable.map(a => ({
    path: `/${a.data.category}/${a.slug}/`,
    lastmod: toDate(a.data.updatedAt) ?? toDate(a.data.publishedAt),
  }));

  const categories = ['voce', 'povrce', 'bilje', 'vijesti'];
  const categoryEntries: Entry[] = categories.map(cat => ({
    path: `/${cat}/`,
    lastmod: maxDate(
      indexable.filter(a => a.data.category === cat).map(a => toDate(a.data.updatedAt) ?? toDate(a.data.publishedAt)),
    ),
  }));

  const homeEntry: Entry = {
    path: '/',
    lastmod: maxDate(articleEntries.map(e => e.lastmod)),
  };

  // Statične stranice iz CMS-a (bez lastmod: nemamo pouzdan datum sadržajne izmjene).
  const pageEntries: Entry[] = pages
    .filter(p => !p.data.noindex)
    .map(p => ({ path: `/${p.slug}/` }));

  // Stranice autora (bez lastmod iz istog razloga).
  const authorEntries: Entry[] = authors.map(a => ({ path: `/autor/${a.data.slug}/` }));

  const seen = new Set<string>();
  const all = [homeEntry, ...categoryEntries, ...pageEntries, ...authorEntries, ...articleEntries].filter(e => {
    if (seen.has(e.path)) return false;
    seen.add(e.path);
    return true;
  });

  const body = all
    .map(e => {
      const loc = escapeXml(`${SITE}${encodeURI(e.path)}`);
      return `  <url>\n    <loc>${loc}</loc>${e.lastmod ? `\n    <lastmod>${e.lastmod}</lastmod>` : ''}\n  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
