// Rehype plugin: prvo spominjanje pojma iz pojmovnika u članku postaje poveznica na /pojmovnik/#id.
// Pravila:
//  - samo članci kategorija voce, povrce i bilje (ne vijesti ni statične stranice)
//  - svaki pojam najviše jednom po članku, ukupno najviše MAX poveznica
//  - ne dira naslove, postojeće poveznice, tablice, citate (blockquote), kod ni odjeljak Izvori
//  - poveznica nosi data-def (prva rečenica objašnjenja) za oblačić na računalu
import { POJMOVI, regexZa, kratko } from '../data/pojmovnik.mjs';

const MAX = 6;
const KATEGORIJE = new Set(['voce', 'povrce', 'bilje']);
const PRESKOCI = new Set(['a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code', 'pre', 'table', 'th', 'td', 'blockquote', 'figcaption', 'script', 'style', 'button', 'label']);

const AUTO = POJMOVI.filter((p) => p.oblici).map((p) => ({ id: p.id, rx: regexZa(p), def: kratko(p.def) }));

function tekst(node) {
  if (node.type === 'text') return node.value;
  return (node.children || []).map(tekst).join('');
}

export function rehypePojmovnik() {
  return (tree, file) => {
    const fm = file?.data?.astro?.frontmatter || {};
    if (!KATEGORIJE.has(fm.category)) return;

    const iskoristeno = new Set();
    let broj = 0;
    let kraj = false;

    function povezi(value) {
      if (broj >= MAX) return null;
      let najbolji = null;
      for (const t of AUTO) {
        if (iskoristeno.has(t.id)) continue;
        const m = t.rx.exec(value);
        if (m && (!najbolji || m.index < najbolji.m.index)) najbolji = { t, m };
      }
      if (!najbolji) return null;
      const { t, m } = najbolji;
      iskoristeno.add(t.id);
      broj += 1;
      const prije = value.slice(0, m.index);
      const rijec = m[0];
      const poslije = value.slice(m.index + rijec.length);
      const out = [];
      if (prije) out.push({ type: 'text', value: prije });
      out.push({
        type: 'element',
        tagName: 'a',
        properties: { href: `/pojmovnik/#${t.id}`, className: ['cv-pojam'], dataDef: t.def },
        children: [{ type: 'text', value: rijec }],
      });
      if (poslije) {
        const dalje = povezi(poslije);
        if (dalje) out.push(...dalje);
        else out.push({ type: 'text', value: poslije });
      }
      return out;
    }

    function hodaj(node, preskoci) {
      if (kraj || broj >= MAX || !node.children) return;
      for (let i = 0; i < node.children.length; i++) {
        const dijete = node.children[i];
        if (dijete.type === 'element') {
          if (/^h[1-6]$/.test(dijete.tagName) && /^\s*Izvori\s*$/i.test(tekst(dijete))) {
            kraj = true;
            return;
          }
          hodaj(dijete, preskoci || PRESKOCI.has(dijete.tagName));
        } else if (dijete.type === 'text' && !preskoci && node.type === 'element') {
          const novi = povezi(dijete.value);
          if (novi) {
            node.children.splice(i, 1, ...novi);
            i += novi.length - 1;
          }
        }
        if (kraj || broj >= MAX) return;
      }
    }

    hodaj(tree, false);
  };
}
