// Zajednički izračuni za kalkulatore: koristi ih i build (početni rezultat u HTML-u)
// i preglednik (izračun dok čitatelj mijenja polja). Vraćaju gotov HTML odlomka rezultata.

export const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** Broj s decimalnim zarezom, najviše dvije decimale. */
export const fmt = (x) => String(Math.round(x * 100) / 100).replace('.', ',');

/** Hrvatska množina: [1 rajčicu, 2 rajčice, 5 rajčica] */
export function mnozina(n, [jedan, dva, pet]) {
  const d = n % 10;
  const s = n % 100;
  if (d === 1 && s !== 11) return jedan;
  if (d >= 2 && d <= 4 && (s < 12 || s > 14)) return dva;
  return pet;
}

export function sadniceRez(c, d, w, s, r) {
  if (!(d > 0 && w > 0 && s > 0 && r > 0)) {
    return 'Upišite dužinu, širinu i razmake veće od nule.';
  }
  const uRedu = Math.max(1, Math.floor((d * 100) / s + 1e-9));
  const redova = Math.max(1, Math.floor((w * 100) / r + 1e-9));
  const n = uRedu * redova;
  return (
    `${c.na || 'Na gredicu'} ${fmt(d)} × ${fmt(w)} m možete posaditi oko <strong>${n} ${mnozina(n, c.biljka)}</strong> ` +
    `(${redova} ${mnozina(redova, ['red', 'reda', 'redova'])}, ${uRedu} ${mnozina(uRedu, ['biljka', 'biljke', 'biljaka'])} u redu).`
  );
}

/** Zaokruži na korak z (zadano 5), nikad ispod jednog koraka. */
const zaok = (x, z = 5) => Math.max(z, Math.round(Math.round(x / z) * z * 1000) / 1000);

export function receptStavke(c, kolicina) {
  const k = Math.min(c.max, Math.max(c.min, kolicina || c.baza));
  const f = k / c.baza;
  return c.sastojci
    .map((s) => {
      const v = Array.isArray(s.k) ? s.k.map((x) => fmt(zaok(x * f, s.z))).join('–') : fmt(zaok(s.k * f, s.z));
      return `<li><strong>${v} ${esc(s.j)}</strong> ${esc(s.n)}</li>`;
    })
    .join('');
}

export function kalorijeRez(c, i, g, u) {
  const s = c.stavke[i] ?? c.stavke[0];
  if (!(g >= 0) || !(u >= 0)) return 'Upišite količinu u gramima.';
  const kStavka = Math.round((s.k * g) / 100);
  const kDodatak = c.dodatak ? Math.round((c.dodatak.k * u) / 100) : 0;
  let html = `Ukupno oko <strong>${kStavka + kDodatak} kcal</strong>`;
  if (c.dodatak && u > 0) {
    const kratko = s.kr || s.n.replace(/\s*\([^)]*\)/g, '').trim();
    const ime = kratko.charAt(0).toLowerCase() + kratko.slice(1);
    html += ` (${esc(ime)} ${kStavka} kcal + ${esc(c.dodatak.kratko)} ${kDodatak} kcal)`;
  }
  return html + '.';
}
