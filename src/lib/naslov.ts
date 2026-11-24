// Jedinstveno pravilo za <title>: separator je uvijek " | ", a "| Cultivias" se dodaje
// samo ako cijeli naslov stane u 60 znakova (inače bi ga Google ionako skratio).
export const BRAND = 'Cultivias';
export const MAX_TITLE = 60;

export function pageTitle(naslov: string): string {
  const t = naslov.trim();
  if (t.includes(BRAND)) return t;
  const sBrendom = `${t} | ${BRAND}`;
  return sBrendom.length <= MAX_TITLE ? sBrendom : t;
}
