// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import { rehypeBlokovi } from './src/lib/blokovi.mjs';
import { rehypePojmovnik } from './src/lib/pojmovnik-rehype.mjs';

// Vanjski linkovi u sadržaju (markdown) otvaraju se u novom tabu, interni u istom.
const INTERNAL_HOSTS = new Set(['cultivias.com', 'www.cultivias.com']);
const ABSOLUTE_URL = /^(https?:)?\/\//i;

function rehypeLinkTargets() {
  const walk = (node) => {
    if (node.type === 'element' && node.tagName === 'a' && node.properties) {
      const href = node.properties.href;
      if (typeof href === 'string' && ABSOLUTE_URL.test(href)) {
        let host = '';
        try {
          host = new URL(href, 'https://www.cultivias.com').hostname.toLowerCase();
        } catch {
          host = '';
        }
        if (host && !INTERNAL_HOSTS.has(host)) {
          node.properties.target = '_blank';
          node.properties.rel = ['noopener', 'noreferrer'];
        } else if (host) {
          delete node.properties.target;
        }
      } else if (typeof href === 'string' && (href.startsWith('/') || href.startsWith('#'))) {
        delete node.properties.target;
      }
    }
    if (node.children) node.children.forEach(walk);
  };
  return (tree) => walk(tree);
}

export default defineConfig({
  site: 'https://www.cultivias.com',
  base: '/',
  integrations: [
    tailwind({ applyBaseStyles: false }),
  ],
  output: 'static',
  // Preusmjeravanja sa starih URL-ova (naslovi promijenjeni u neutralnije, 23. 11. 2026.).
  // GitHub Pages ne podržava 301, pa Astro stvara stranicu s trenutnim preusmjeravanjem i canonical oznakom.
  redirects: {
    '/bilje/dobrobiti-čaja-od-mente-za-san-pamćenje-i-probavu': '/bilje/caj-od-mente-san-pamcenje-i-probava/',
    '/bilje/kamilica-olakšanje-probave-nadutosti-i-grčeva': '/bilje/kamilica-i-probava/',
    '/bilje/hladni-oblozi-od-kamilice-prirodno-rješenje-za-opuštanje': '/bilje/hladni-oblozi-od-kamilice/',
    '/bilje/kadulja-i-ljekovitost-zašto-bi-mogla-biti-dobar-izbor': '/bilje/kadulja-i-ljekovitost-sto-kazu-istrazivanja/',
    '/voce/aronija--čudesna-biljka-za-podršku-zdravlja': '/voce/aronija-sastav-upotreba-i-istrazivanja/',
    '/voce/crni-ribiz-i-željezo-prirodna-podrška-vitalnosti': '/voce/crni-ribiz-i-zeljezo/',
    '/voce/crni-ribiz-ljekovitost-i-zdravstvene-prednosti': '/voce/crni-ribiz-i-zdravlje/',
    '/povrce/mrkva-kompletan-vodič-o-zdravstvenim-prednostima-sadnji-i-nutritivnoj-vrijednosti': '/povrce/mrkva-nutritivna-vrijednost-zdravlje-i-sadnja/',
    '/bilje/sve-što-trebate-znati-o-rajčici-od-sadnje-do-zdravstvenih-benefita': '/bilje/sve-o-rajcici-od-sadnje-do-prehrambene-vrijednosti/',
    '/bilje/limunski-eukaliptus-prirodna-zaštita-protiv-komaraca': '/bilje/limunski-eukaliptus-i-komarci/',
    '/voce/ogrozd--zaboravljeno-supervoće': '/voce/ogrozd-zaboravljeno-voce/',
    '/voce/naranča-vitaminska-bomba-u-jednoj-čaši': '/voce/naranca-nutritivna-vrijednost-vrste-i-uzgoj/',
    '/voce/bazga-zova-sve-o-ovoj-moćnoj-i-poznatoj-biljci': '/voce/bazga-zova-sve-o-ovoj-poznatoj-biljci/',
    '/bilje/majčina-dušica-vodič-kroz-ljekovita-svojstva-i-upotrebu': '/bilje/majcina-dusica-sastav-uzgoj-i-upotreba/',
  },
  markdown: {
    // rehypeBlokovi: Ukratko, kalendar, Oprez i kalkulatori (src/lib/blokovi.mjs)
    // rehypePojmovnik: prvo spominjanje pojma -> /pojmovnik/#id (src/lib/pojmovnik-rehype.mjs)
    rehypePlugins: [rehypeLinkTargets, rehypeBlokovi, rehypePojmovnik],
  },
  vite: {
    plugins: [
      {
        name: 'ignore-empty-md-imports',
        resolveId(id, importer) {
          if (id === '' && importer?.match(/\.(md|mdx)$/)) {
            return '\0virtual:empty-md-import';
          }
        },
        load(id) {
          if (id === '\0virtual:empty-md-import') return 'export default ""';
        },
      },
    ],
    build: {
      rollupOptions: {
        external: ['/pagefind/pagefind.js'],
      },
    },
  },
});
