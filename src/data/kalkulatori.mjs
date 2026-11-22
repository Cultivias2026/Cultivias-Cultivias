// Kalkulatori u člancima.
// U tekst članka (markdown) stavi oznaku na zasebnom retku, s praznim retkom iznad i ispod:
//   <div data-kalkulator="rajcica-sadnice"></div>
// Ključ mora postojati ovdje. Brojke moraju biti iste kao u članku i njegovim izvorima.
//
// Tipovi:
//   sadnice  – koliko biljaka stane na gredicu (razmak u redu i između redova)
//   recept   – preračun količina recepta prema glavnom sastojku
//   kalorije – kalorije porcije prema masi (kcal na 100 g) + po želji dodatak (npr. ulje)

export const KALKULATORI = {
  'rajcica-sadnice': {
    tip: 'sadnice',
    naslov: 'Koliko rajčica stane na vašu gredicu?',
    // akuzativ: posaditi 1 rajčicu, 2 rajčice, 5 rajčica
    biljka: ['rajčicu', 'rajčice', 'rajčica'],
    d: 4,
    w: 1.2,
    presets: [
      { n: 'Niske (determinantne) sorte', s: 50, r: 100 },
      { n: 'Visoke (indeterminantne) sorte', s: 60, r: 130 },
    ],
    napomena:
      'Polazni razmaci sredina su raspona iz članka i možete ih promijeniti. Od ruba gredice računa se pola razmaka. Ako je gredica uža od razmaka između redova, stane jedan red.',
  },

  'aronija-pekmez': {
    tip: 'recept',
    naslov: 'Preračunajte recept na svoju količinu aronije',
    label: 'Količina očišćene aronije',
    jedinica: 'g',
    baza: 250,
    min: 100,
    max: 1000,
    korak: 50,
    sastojci: [
      { n: 'očišćene aronije', k: 250, j: 'g' },
      { n: 'jabuke, izvagane nakon guljenja i uklanjanja sjemene kućice', k: 250, j: 'g' },
      { n: 'bijelog šećera', k: 200, j: 'g' },
      { n: 'vode', k: 50, j: 'ml' },
      { n: 'limunova soka', k: 15, j: 'ml' },
    ],
    napomena:
      'Količine su zaokružene na 5 g ili 5 ml. Veća tura kuha se dulje, a gustoću uvijek provjerite na hladnom tanjuriću. I veća količina ostaje namaz za hladnjak (3–4 dana) ili zamrzivač, a ne zimnica za policu.',
  },

  'rajcica-kalorije': {
    tip: 'kalorije',
    naslov: 'Izračunajte kalorije svoje porcije',
    labelStavka: 'Oblik rajčice',
    stavke: [
      { n: 'Svježa rajčica', k: 18, g: 123 },
      { n: 'Kućno smrznuta, bez dodataka', k: 18, g: 150 },
      { n: 'Passata', k: 36, g: 150 },
      { n: 'Dvostruki koncentrat', k: 96, g: 15 },
      { n: 'Umak s genovskim bosiljkom', k: 56, g: 125 },
    ],
    dodatak: { n: 'Maslinovo ulje', kratko: 'ulje', k: 884 },
    napomena:
      'Vrijednosti na 100 g iste su kao u tablici: svježa rajčica i maslinovo ulje prema bazi USDA, a passata, koncentrat i umak prema deklaracijama proizvođača Mutti. Za drugi proizvod pogledajte kalorije na 100 g na deklaraciji.',
  },
};
