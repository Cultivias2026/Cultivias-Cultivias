// Blokovi u tekstu članka: Ukratko (profil biljke + kalendar radova), Oprez i kalkulatori.
//
// Ukratko, kalendar i Oprez pišu se u frontmatter članka (polja `ukratko`, `kalendar`, `oprez`)
// i sami se umeću iza uvodnog odlomka. Na drugo mjesto ih možeš staviti oznakom
//   <div data-blok="ukratko"></div>   ili   <div data-blok="oprez"></div>
// Kalkulator se umeće oznakom <div data-kalkulator="kljuc"></div> (ključevi u src/data/kalkulatori.mjs).
// Sve se pretvara u običan HTML već pri buildu, pa ga Google i čitatelji vide bez JavaScripta.

import { KALKULATORI } from '../data/kalkulatori.mjs';
import { esc, fmt, sadniceRez, receptStavke, kalorijeRez } from './kalk-racun.mjs';

const MJESECI = ['siječanj', 'veljača', 'ožujak', 'travanj', 'svibanj', 'lipanj', 'srpanj', 'kolovoz', 'rujan', 'listopad', 'studeni', 'prosinac'];
const MJ_KRATKO = ['sij', 'velj', 'ožu', 'tra', 'svi', 'lip', 'srp', 'kol', 'ruj', 'lis', 'stu', 'pro'];
const RIMSKI = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
const VRSTE = new Set(['sjetva', 'sadnja', 'cvatnja', 'berba', 'rezidba', 'njega']);

const IKONA_LIST =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>';
const IKONA_OPREZ =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>';
const IKONA_KALK =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="16" height="20" x="4" y="2" rx="2"/><path d="M8 6h8"/><path d="M16 14v4"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>';

const INTERNI = /^(\/|#|https?:\/\/(www\.)?cultivias\.com)/i;

/** Mali dio markdowna u vrijednostima: *kurziv* i [tekst](url). */
function inline(s) {
  let out = esc(s);
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) =>
    INTERNI.test(u) ? `<a href="${u}">${t}</a>` : `<a href="${u}" target="_blank" rel="noopener noreferrer">${t}</a>`,
  );
  out = out.replace(/\*([^*]+)\*/g, '<i>$1</i>');
  // broj i jedinica ostaju u istom retku (20 cm, 6 sati, 15 litara)
  out = out.replace(/(\d) (cm|m|g|ml|l|kcal|sati|dana|tjedana|mjeseci|litara)(?=[\s,.;)]|$)/g, '$1&nbsp;$2');
  return out;
}

/** [3,4,5,8] → "ožujak – svibanj, kolovoz" */
function rasponi(mjeseci) {
  const s = [...new Set(mjeseci)].sort((a, b) => a - b);
  if (!s.length) return '';
  const dijelovi = [];
  let pocetak = s[0];
  let prethodni = s[0];
  for (let i = 1; i <= s.length; i++) {
    const m = s[i];
    if (m === prethodni + 1) {
      prethodni = m;
      continue;
    }
    dijelovi.push(pocetak === prethodni ? MJESECI[pocetak - 1] : `${MJESECI[pocetak - 1]} – ${MJESECI[prethodni - 1]}`);
    pocetak = m;
    prethodni = m;
  }
  return dijelovi.join(', ');
}

function renderKalendar(k) {
  let h = '<div class="cv-kal"><p class="cv-kal__naslov">Kalendar radova</p>';
  h +=
    '<div class="cv-kal__red cv-kal__zaglavlje" aria-hidden="true"><div class="cv-kal__opis"></div><div class="cv-kal__traka">' +
    MJ_KRATKO.map((m, i) => `<span><span class="cv-kal__dug">${m}</span><span class="cv-kal__rim">${RIMSKI[i]}</span></span>`).join('') +
    '</div></div>';
  for (const r of k.redovi) {
    const vrsta = VRSTE.has(r.vrsta) ? r.vrsta : 'njega';
    const on = new Set(r.mjeseci || []);
    const mozda = new Set(r.moguce || []);
    const opis =
      r.opis || rasponi(r.mjeseci || []) + (r.moguce?.length ? `, ponekad i ${rasponi(r.moguce)}` : '');
    h +=
      `<div class="cv-kal__red"><div class="cv-kal__opis"><strong>${esc(r.radnja)}</strong><span>${inline(opis)}</span></div>` +
      `<div class="cv-kal__traka" aria-hidden="true">` +
      MJESECI.map((_, i) => {
        const m = i + 1;
        if (on.has(m)) return `<span class="on ${vrsta}"></span>`;
        if (mozda.has(m)) return `<span class="mozda ${vrsta}"></span>`;
        return '<span></span>';
      }).join('') +
      '</div></div>';
  }
  if (k.napomena) h += `<p class="cv-kal__nap">${inline(k.napomena)}</p>`;
  return h + '</div>';
}

function renderUkratko(fm) {
  const u = fm.ukratko;
  const k = fm.kalendar;
  if (!u?.stavke?.length && !k?.redovi?.length) return '';
  const naslov = u?.naslov || 'Ukratko';
  let h = `<aside class="cv-blok cv-ukratko not-prose" aria-label="${esc(naslov)}">`;
  h += `<p class="cv-blok__naslov">${IKONA_LIST}<span>${esc(naslov)}</span></p>`;
  if (u?.stavke?.length) {
    h +=
      '<dl class="cv-ukratko__dl">' +
      u.stavke.map((s) => `<div><dt>${esc(s.k)}</dt><dd>${inline(s.v)}</dd></div>`).join('') +
      '</dl>';
  }
  if (k?.redovi?.length) h += renderKalendar(k);
  if (u?.izvori?.length) h += `<p class="cv-blok__izvor">Izvori: ${u.izvori.map(inline).join(' · ')}</p>`;
  return h + '</aside>';
}

function renderOprez(fm) {
  const o = fm.oprez;
  if (!o?.stavke?.length) return '';
  let h = `<aside class="cv-blok cv-oprez not-prose" role="note" aria-label="Oprez">`;
  h += `<p class="cv-blok__naslov">${IKONA_OPREZ}<span>Oprez</span></p>`;
  h += '<ul>' + o.stavke.map((s) => `<li>${inline(s)}</li>`).join('') + '</ul>';
  if (o.vise) {
    h += `<p class="cv-oprez__vise"><a href="${esc(o.vise)}">${esc(o.viseTekst || 'Više o nuspojavama i kontraindikacijama')} ↓</a></p>`;
  }
  return h + '</aside>';
}

const polje = (label, k, v, { min, max, step }, mod = '') =>
  `<label class="cv-kalk__polje${mod}"><span>${esc(label)}</span>` +
  `<input type="number" inputmode="decimal" min="${min}" max="${max}" step="${step}" value="${v}" data-k="${k}"></label>`;

function kalkPocetak(tip, c) {
  return (
    `<div class="cv-blok cv-kalk not-prose" data-kalk="${tip}" data-config="${esc(JSON.stringify(c))}">` +
    `<p class="cv-blok__naslov">${IKONA_KALK}<span>${esc(c.naslov)}</span></p>`
  );
}

function renderKalkulator(id) {
  const c = KALKULATORI[id];
  if (!c) throw new Error(`Nepoznat kalkulator "${id}" – dodaj ga u src/data/kalkulatori.mjs`);

  if (c.tip === 'sadnice') {
    const p = c.presets[0];
    return (
      kalkPocetak('sadnice', c) +
      '<div class="cv-kalk__polja">' +
      polje(c.lD || 'Dužina gredice (m)', 'd', fmt(c.d).replace(',', '.'), { min: 0.5, max: 100, step: 0.1 }) +
      polje(c.lW || 'Širina gredice (m)', 'w', fmt(c.w).replace(',', '.'), { min: 0.3, max: 50, step: 0.1 }) +
      `<label class="cv-kalk__polje cv-kalk__polje--siroko"><span>${esc(c.lPreset || 'Sorta')}</span><select data-k="preset">` +
      c.presets.map((x, i) => `<option value="${i}">${esc(x.n)}</option>`).join('') +
      '</select></label>' +
      polje('Razmak u redu (cm)', 's', p.s, { min: 1, max: 500, step: 1 }) +
      polje('Razmak između redova (cm)', 'r', p.r, { min: 5, max: 600, step: 5 }) +
      '</div>' +
      `<p class="cv-kalk__rez" data-rez aria-live="polite">${sadniceRez(c, c.d, c.w, p.s, p.r)}</p>` +
      `<p class="cv-kalk__nap">${inline(c.napomena)}</p></div>`
    );
  }

  if (c.tip === 'recept') {
    return (
      kalkPocetak('recept', c) +
      '<div class="cv-kalk__polja">' +
      polje(`${c.label} (${c.jedinica})`, 'kol', c.baza, { min: c.min, max: c.max, step: c.korak }, ' cv-kalk__polje--siroko') +
      '</div>' +
      `<p class="cv-kalk__podnaslov">Trebat će vam:</p>` +
      `<ul class="cv-kalk__popis" data-rez aria-live="polite">${receptStavke(c, c.baza)}</ul>` +
      `<p class="cv-kalk__nap">${inline(c.napomena)}</p></div>`
    );
  }

  if (c.tip === 'kalorije') {
    const s = c.stavke[0];
    return (
      kalkPocetak('kalorije', c) +
      '<div class="cv-kalk__polja">' +
      `<label class="cv-kalk__polje cv-kalk__polje--siroko"><span>${esc(c.labelStavka)}</span><select data-k="stavka">` +
      c.stavke.map((x, i) => `<option value="${i}">${esc(x.n)} (${x.k} kcal na 100 ${x.j || 'g'})</option>`).join('') +
      '</select></label>' +
      polje(c.stavke.some((x) => x.j === 'ml') ? 'Količina (g ili ml)' : 'Količina (g)', 'g', s.g, { min: 0, max: 2000, step: 1 }) +
      (c.dodatak ? polje(`${c.dodatak.n} (g)`, 'u', 0, { min: 0, max: 200, step: 1 }) : '') +
      '</div>' +
      `<p class="cv-kalk__rez" data-rez aria-live="polite">${kalorijeRez(c, 0, s.g, 0)}</p>` +
      `<p class="cv-kalk__nap">${inline(c.napomena)}</p></div>`
    );
  }

  throw new Error(`Nepoznat tip kalkulatora "${c.tip}" (${id})`);
}

const OZNAKA = /^\s*<div\s+data-(kalkulator|blok)="([a-z0-9-]+)"\s*>\s*<\/div>\s*$/i;

export function rehypeBlokovi() {
  return (tree, file) => {
    const fm = file.data?.astro?.frontmatter ?? {};
    const djeca = tree.children;
    let imaUkratko = false;
    let imaOprez = false;

    for (const n of djeca) {
      if (n.type !== 'raw') continue;
      const m = n.value.match(OZNAKA);
      if (!m) continue;
      if (m[1] === 'kalkulator') {
        n.value = renderKalkulator(m[2]);
      } else if (m[2] === 'ukratko') {
        n.value = renderUkratko(fm);
        imaUkratko = true;
      } else if (m[2] === 'oprez') {
        n.value = renderOprez(fm);
        imaOprez = true;
      }
    }

    const umetni = [];
    if (!imaUkratko) {
      const h = renderUkratko(fm);
      if (h) umetni.push(h);
    }
    if (!imaOprez) {
      const h = renderOprez(fm);
      if (h) umetni.push(h);
    }
    if (!umetni.length) return;

    // Iza uvodnog odlomka (prvi <p> prije prvog naslova). Ako tekst počinje napomenom
    // (blockquote) bez odlomka, iza napomene; inače na početak teksta.
    let mjesto = 0;
    for (let i = 0; i < djeca.length; i++) {
      const n = djeca[i];
      if (n.type !== 'element') continue;
      if (/^h[1-6]$/.test(n.tagName)) break;
      if (n.tagName === 'blockquote') mjesto = i + 1;
      if (n.tagName === 'p') {
        mjesto = i + 1;
        break;
      }
    }
    djeca.splice(mjesto, 0, ...umetni.map((value) => ({ type: 'raw', value })));
  };
}
