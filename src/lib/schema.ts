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
  /** schema.org tip: WebPage, CollectionPage, AboutPage, ProfilePage ... */
  type?: string;
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
