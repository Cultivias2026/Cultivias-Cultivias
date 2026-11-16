// Centralizirana JSON-LD (schema.org) logika za Cultivias.
//
// Svaka stranica šalje svoje čvorove u buildGraph(), a Organization + WebSite
// se dodaju automatski. Tako je graf na svakoj stranici samostalan i povezan
// preko @id referenci (WebPage -> WebSite -> Organization).
//
// Sve URL-ove gradimo na kanonskoj domeni (www), isto kao <link rel="canonical">.
import { getEntry } from 'astro:content';

export const SITE_URL = 'https://www.cultivias.com';
export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
const LOGO_ID = `${SITE_URL}/#logo`;
const LOGO_URL = `${SITE_URL}/images/logo.webp`; // public/images/logo.webp (200x200)

type Node = Record<string, unknown>;

/** Relativni put -> apsolutni URL na kanonskoj domeni. */
export function abs(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}

export const webPageId = (path: string) => `${abs(path)}#webpage`;
export const breadcrumbId = (path: string) => `${abs(path)}#breadcrumb`;

// ---------------------------------------------------------------------------
// Globalni čvorovi (Organization + WebSite)
// ---------------------------------------------------------------------------
function organizationNode(s: any): Node {
  const sameAs = [s.social?.facebook, s.social?.instagram, s.social?.youtube].filter(
    (u: unknown): u is string => typeof u === 'string' && /^https?:\/\//.test(u)
  );

  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: s.siteName,
    url: `${SITE_URL}/`,
    description: s.description,
    logo: {
      '@type': 'ImageObject',
      '@id': LOGO_ID,
      url: LOGO_URL,
      contentUrl: LOGO_URL,
      width: 200,
      height: 200,
      caption: s.siteName,
    },
    ...(sameAs.length ? { sameAs } : {}),
  };
}

function websiteNode(s: any): Node {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: `${SITE_URL}/`,
    name: s.siteName,
    alternateName: 'Cultivias.com',
    description: s.description,
    inLanguage: 'hr',
    publisher: { '@id': ORG_ID },
  };
}

/** Sastavlja @graph; Organization i WebSite dolaze prvi na svakoj stranici. */
export async function buildGraph(nodes: Node[]): Promise<Node> {
  const s = (await getEntry('settings', 'site'))!.data;
  return {
    '@context': 'https://schema.org',
    '@graph': [organizationNode(s), websiteNode(s), ...nodes],
  };
}

// ---------------------------------------------------------------------------
// Čvorovi stranica
// ---------------------------------------------------------------------------
interface WebPageOptions {
  /** Put stranice, npr. '/voce/' ili '/' */
  path: string;
  name: string;
  description?: string;
  /** schema.org tip: WebPage, CollectionPage, AboutPage, ProfilePage ... (ili popis tipova) */
  type?: string | string[];
  /** Ako stranica ima BreadcrumbList čvor u grafu */
  hasBreadcrumb?: boolean;
  extra?: Node;
}

export function webPageNode({
  path,
  name,
  description,
  type = 'WebPage',
  hasBreadcrumb = false,
  extra = {},
}: WebPageOptions): Node {
  return {
    '@type': type,
    '@id': webPageId(path),
    url: abs(path),
    name,
    ...(description ? { description } : {}),
    inLanguage: 'hr',
    isPartOf: { '@id': WEBSITE_ID },
    ...(hasBreadcrumb ? { breadcrumb: { '@id': breadcrumbId(path) } } : {}),
    ...extra,
  };
}

/** BreadcrumbList; `path` je put stranice na kojoj se nalazi (za @id). */
export function breadcrumbNode(path: string, items: { name: string; path: string }[]): Node {
  return {
    '@type': 'BreadcrumbList',
    '@id': breadcrumbId(path),
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: abs(item.path),
    })),
  };
}

// ---------------------------------------------------------------------------
// Autori
// ---------------------------------------------------------------------------
interface AuthorData {
  name: string;
  slug?: string;
  title?: string;
  role?: 'expert' | 'editor';
  bio_short?: string;
  avatar?: string;
}

export const authorPath = (slug: string) => `/autor/${slug}/`;
export const authorId = (slug: string) => `${abs(authorPath(slug))}#author`;

/**
 * Kratka referenca autora za Article. Uredništvo (role: 'editor') je
 * Organization, stručni autori su Person.
 */
export function authorRef(slug: string, author?: AuthorData): Node {
  return {
    '@type': author?.role === 'editor' ? 'Organization' : 'Person',
    '@id': authorId(slug),
    name: author?.name ?? slug,
    url: abs(authorPath(slug)),
  };
}

/** Puni čvor autora za stranicu autora (ProfilePage.mainEntity). */
export function authorNode(slug: string, author: AuthorData): Node {
  const isOrg = author.role === 'editor';
  return {
    ...authorRef(slug, author),
    ...(author.bio_short ? { description: author.bio_short } : {}),
    ...(author.avatar ? { image: abs(author.avatar) } : {}),
    ...(isOrg
      ? { parentOrganization: { '@id': ORG_ID } }
      : author.title
        ? { jobTitle: author.title }
        : {}),
  };
}

// ---------------------------------------------------------------------------
// FAQ: pitanja iz teksta članka
// ---------------------------------------------------------------------------
// Pitanje je svaki naslov (## ... ######) koji završava znakom "?". Odgovor je
// tekst odjeljka do sljedećeg naslova iste ili više razine, pretvoren u običan
// tekst. Tako schema uvijek odgovara onome što posjetitelj vidi na stranici.

// [tekst](url "naslov") — url smije imati jednu razinu zagrada, naslov bilo što
const LINK_TAIL = String.raw`\((?:[^()"'\s]|\([^()]*\))*(?:\s+(?:"[^"]*"|'[^']*'))?\s*\)`;
const IMAGE_RE = new RegExp(String.raw`!\[[^\]]*\]` + LINK_TAIL, 'g');
const LINK_RE = new RegExp(String.raw`\[([^\]]*)\]` + LINK_TAIL, 'g');

/** Inline markdown -> običan tekst. */
function inlineToText(s: string): string {
  return s
    .replace(IMAGE_RE, '')
    .replace(LINK_RE, '$1')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*([^*\s][^*]*?)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Markdown blok (odlomci, popisi, tablice, citati) -> običan tekst, jedan red po bloku. */
function sectionToText(lines: string[]): string {
  const out: string[] = [];
  let para: string[] = [];
  const flush = () => {
    if (para.length) {
      const t = inlineToText(para.join(' '));
      if (t) out.push(t);
      para = [];
    }
  };

  for (const raw of lines) {
    const line = raw.replace(/\s+$/, '');
    if (!line.trim()) { flush(); continue; }
    if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) { flush(); continue; }

    // tablica: preskoči redak s razdjelnicima, ostale retke spoji s " | "
    if (/^\s*\|/.test(line)) {
      flush();
      if (/^[\s|:-]+$/.test(line)) continue;
      const cells = line.trim().replace(/^\||\|$/g, '').split('|').map(inlineToText).filter(Boolean);
      if (cells.length) out.push(cells.join(' | '));
      continue;
    }

    const heading = line.match(/^\s*#{1,6}\s+(.*?)\s*#*\s*$/);
    if (heading) {
      flush();
      const t = inlineToText(heading[1]);
      if (t) out.push(t);
      continue;
    }

    const item = line.match(/^\s*(?:[-*+]|\d+[.)])\s+(.*)$/);
    if (item) { flush(); para.push(item[1]); continue; }

    para.push(line.replace(/^\s*>\s?/, '').trim());
  }
  flush();
  return out.join('\n');
}

export interface FaqItem {
  question: string;
  answer: string;
}

/** Vadi pitanja i odgovore iz markdown teksta članka. */
export function extractQuestions(markdown: string): FaqItem[] {
  const lines = markdown.replace(/\r\n?/g, '\n').split('\n');

  const heads: { i: number; level: number; text: string }[] = [];
  let fenced = false;
  lines.forEach((l, i) => {
    if (/^\s*(```|~~~)/.test(l)) { fenced = !fenced; return; }
    if (fenced) return;
    const m = l.match(/^(#{2,6})\s+(.+?)\s*#*\s*$/);
    if (m) heads.push({ i, level: m[1].length, text: inlineToText(m[2]) });
  });

  const items: FaqItem[] = [];
  const seen = new Set<string>();
  heads.forEach((h, k) => {
    if (!h.text.endsWith('?') || seen.has(h.text)) return;
    const next = heads.slice(k + 1).find((x) => x.level <= h.level);
    const answer = sectionToText(lines.slice(h.i + 1, next ? next.i : lines.length));
    if (!answer) return;
    seen.add(h.text);
    items.push({ question: h.text, answer });
  });
  return items;
}

/** Question/Answer čvorovi za FAQPage.mainEntity. */
export function faqQuestionNodes(items: FaqItem[]): Node[] {
  return items.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer },
  }));
}
