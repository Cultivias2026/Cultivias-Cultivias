// Kalkulatori u članku: računaju dok čitatelj mijenja polja.
// Početni rezultat već je u HTML-u (izračunat pri buildu istim funkcijama).
import { sadniceRez, receptStavke, kalorijeRez } from '../lib/kalk-racun.mjs';

const broj = (el: HTMLInputElement | HTMLSelectElement | null) => {
  const v = parseFloat(String(el?.value ?? '').replace(',', '.'));
  return Number.isFinite(v) ? v : NaN;
};

document.querySelectorAll<HTMLElement>('[data-kalk]').forEach((el) => {
  const tip = el.dataset.kalk;
  let c: any;
  try {
    c = JSON.parse(el.dataset.config || '{}');
  } catch {
    return;
  }
  const q = (k: string) => el.querySelector<HTMLInputElement & HTMLSelectElement>(`[data-k="${k}"]`);
  const rez = el.querySelector<HTMLElement>('[data-rez]');
  if (!rez) return;

  const izracun = () => {
    if (tip === 'sadnice') {
      rez.innerHTML = sadniceRez(c, broj(q('d')), broj(q('w')), broj(q('s')), broj(q('r')));
    } else if (tip === 'recept') {
      rez.innerHTML = receptStavke(c, broj(q('kol')));
    } else if (tip === 'kalorije') {
      rez.innerHTML = kalorijeRez(c, Number(q('stavka')?.value ?? 0), broj(q('g')), c.dodatak ? broj(q('u')) || 0 : 0);
    }
  };

  const naPromjenu = (e: Event) => {
    const t = e.target as HTMLElement;
    // Promjena sorte upisuje njezine razmake; promjena oblika upisuje uobičajenu porciju.
    if (tip === 'sadnice' && t.matches('[data-k="preset"]')) {
      const p = c.presets[Number((t as HTMLSelectElement).value)];
      if (p) {
        q('s')!.value = String(p.s);
        q('r')!.value = String(p.r);
      }
    }
    if (tip === 'kalorije' && t.matches('[data-k="stavka"]')) {
      const s = c.stavke[Number((t as HTMLSelectElement).value)];
      if (s) q('g')!.value = String(s.g);
    }
    izracun();
  };
  el.addEventListener('input', naPromjenu);
  el.addEventListener('change', naPromjenu);
});
