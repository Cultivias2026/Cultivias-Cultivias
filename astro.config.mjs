// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

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
  markdown: {
    rehypePlugins: [rehypeLinkTargets],
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
