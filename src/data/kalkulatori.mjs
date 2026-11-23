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

  'menta-sok': {
    tip: 'recept',
    naslov: 'Preračunajte recept na svoju količinu vode',
    label: 'Količina vode',
    jedinica: 'l',
    baza: 5,
    min: 1,
    max: 10,
    korak: 0.5,
    sastojci: [
      { n: 'hladne vode', k: 5, j: 'l', z: 0.5 },
      { n: 'kristalnog šećera', k: 5, j: 'kg', z: 0.1 },
      { n: 'svježih listova mente', k: [200, 250], j: 'g', z: 5 },
      { n: 'limunske kiseline', k: [15, 20], j: 'g', z: 1 },
    ],
    napomena:
      'Omjer je isti kao u receptu: kilogram šećera na litru vode. Gotov sirup čuvajte u hladnjaku do dva mjeseca ili ga zamrznite.',
  },

  'ribiz-sadnice': {
    tip: 'sadnice',
    naslov: 'Koliko grmova crnog ribiza stane u vaš vrt?',
    biljka: ['grm', 'grma', 'grmova'],
    na: 'Na površinu',
    lD: 'Dužina površine (m)',
    lW: 'Širina površine (m)',
    lPreset: 'Način uzgoja',
    d: 10,
    w: 5,
    presets: [
      { n: 'Kućni vrt', s: 125, r: 225 },
      { n: 'Plantažni nasad', s: 110, r: 300 },
    ],
    napomena:
      'Polazni razmaci sredina su raspona iz tablice u članku i možete ih promijeniti. Od ruba površine računa se pola razmaka. Odrastao grm naraste oko 1,5 m u visinu i širinu, pa bujnijim sortama ostavite više mjesta.',
  },

  'ribiz-kapi': {
    tip: 'recept',
    naslov: 'Preračunajte recept na svoju količinu bobica',
    label: 'Količina bobica crnog ribiza',
    jedinica: 'g',
    baza: 500,
    min: 250,
    max: 1500,
    korak: 50,
    sastojci: [
      { n: 'zrelih, neoštećenih bobica crnog ribiza', k: 500, j: 'g' },
      { n: 'votke ili druge žestice jakosti 40–50 %', k: 1000, j: 'ml', z: 50 },
    ],
    napomena:
      'Omjer je isti kao u receptu: litra žestice na pola kilograma bobica. Koristite samo alkohol namijenjen piću i dovoljno veliku steriliziranu staklenku.',
  },

  'ogrozd-sadnice': {
    tip: 'sadnice',
    naslov: 'Koliko grmova ogrozda stane u vaš vrt?',
    biljka: ['grm', 'grma', 'grmova'],
    na: 'Na površinu',
    lD: 'Dužina površine (m)',
    lW: 'Širina površine (m)',
    lPreset: 'Oblik uzgoja',
    d: 10,
    w: 6,
    presets: [
      { n: 'Grm', s: 175, r: 275 },
      { n: 'Grm u kućnom vrtu (RHS)', s: 135, r: 275 },
      { n: 'Stablo', s: 110, r: 275 },
    ],
    napomena:
      'Polazni razmaci sredina su raspona iz članka i možete ih promijeniti. Od ruba površine računa se pola razmaka. Dovoljan razmak važan je za strujanje zraka i manje bolesti.',
  },

  'kupina-sadnice': {
    tip: 'sadnice',
    naslov: 'Koliko kupina stane u vaš vrt?',
    biljka: ['biljku', 'biljke', 'biljaka'],
    na: 'Na površinu',
    lD: 'Dužina površine (m)',
    lW: 'Širina površine (m)',
    lPreset: 'Sorte',
    d: 10,
    w: 6,
    presets: [{ n: 'Uspravne sorte', s: 125, r: 275 }],
    napomena:
      'Polazni razmaci sredina su raspona za uspravne sorte iz članka. Bujne sorte koje se vežu na žicu trebaju 2,5 do 4,5 m u redu, pa razmak u redu prilagodite. Od ruba površine računa se pola razmaka.',
  },

  'mrkva-sadnice': {
    tip: 'sadnice',
    naslov: 'Koliko mrkve stane na vašu gredicu?',
    biljka: ['mrkvu', 'mrkve', 'mrkava'],
    d: 2,
    w: 1,
    presets: [
      { n: 'Sitnija mrkva (prorjeđivanje na 3–5 cm)', s: 4, r: 25 },
      { n: 'Krupniji korijen (prorjeđivanje na 5–7 cm)', s: 6, r: 25 },
    ],
    lPreset: 'Kakvu mrkvu želite',
    napomena:
      'Razmak u redu odnosi se na biljke nakon prorjeđivanja, a između redova na 20 do 30 cm iz članka. Od ruba gredice računa se pola razmaka.',
  },

  'mrkva-kalorije': {
    tip: 'kalorije',
    naslov: 'Izračunajte kalorije svoje porcije',
    labelStavka: 'Oblik mrkve',
    stavke: [
      { n: 'Sirova mrkva', k: 41, g: 61 },
      { n: 'Kuhana mrkva (u vodi)', k: 35, g: 150 },
      { n: 'Smrznuta mrkva', k: 36, g: 150 },
    ],
    dodatak: { n: 'Maslinovo ulje', kratko: 'ulje', k: 884 },
    napomena:
      'Vrijednosti na 100 g iste su kao u tablici, prema bazi USDA. Za pečenu mrkvu odaberite sirovu i upišite koliko ste ulja dodali.',
  },

  'aronija-kalorije': {
    tip: 'kalorije',
    naslov: 'Izračunajte kalorije svoje porcije',
    labelStavka: 'Oblik aronije',
    stavke: [
      { n: 'Svježe bobice', k: 50, g: 50 },
      { n: 'Kućno smrznute bobice, bez dodataka', k: 50, g: 50 },
      { n: 'Matični sok (primjer proizvoda)', k: 46, g: 50, j: 'ml' },
      { n: 'Sušene bobice (primjer proizvoda)', k: 271, g: 20 },
      { n: 'Prah iz komine (primjer proizvoda)', k: 269, g: 10 },
    ],
    dodatak: { n: 'Šećer', kratko: 'šećer', k: 400 },
    napomena:
      'Vrijednosti su iste kao u tablici: svježe bobice prema norveškoj tablici Matvaretabellen, a sok, sušene bobice i prah prema deklaracijama opisanih proizvoda. Za druge proizvode prepišite kalorije s deklaracije.',
  },

  'bazga-kalorije': {
    tip: 'kalorije',
    naslov: 'Izračunajte kalorije bobica i dodanog šećera',
    labelStavka: 'Oblik',
    stavke: [
      { n: 'Svježe bobice (sirovina prije kuhanja)', k: 73, g: 50 },
      { n: 'Kućno smrznute bobice (sirovina prije kuhanja)', k: 73, g: 50 },
      { n: '100 % sok od bobica (primjer proizvoda)', k: 30, g: 200, j: 'ml' },
    ],
    dodatak: { n: 'Šećer', kratko: 'šećer', k: 400 },
    napomena:
      'Bobice prema bazi USDA, sok prema deklaraciji proizvođača Rabenhorst, a šećer prema tablici Matvaretabellen. Sirove bobice ne jedu se; brojke služe računanju sastojaka prije kuhanja.',
  },

  'ribiz-kalorije': {
    tip: 'kalorije',
    naslov: 'Izračunajte kalorije svoje porcije',
    labelStavka: 'Oblik crnog ribiza',
    stavke: [
      { n: 'Svježe bobice', k: 63, g: 50 },
      { n: 'Kućno smrznute bobice, bez dodataka', k: 63, g: 100 },
      { n: '100 % sok (primjer proizvoda)', k: 37, g: 200, j: 'ml' },
      { n: 'Džem (primjer proizvoda)', k: 236, g: 20 },
    ],
    dodatak: { n: 'Šećer', kratko: 'šećer', k: 400 },
    napomena:
      'Vrijednosti su iste kao u tablici: bobice prema bazi USDA, a sok i džem prema deklaracijama opisanih proizvoda. Šećer se računa sa 400 kcal na 100 g.',
  },

  'kupine-kalorije': {
    tip: 'kalorije',
    naslov: 'Izračunajte kalorije svoje porcije',
    labelStavka: 'Oblik kupina',
    stavke: [
      { n: 'Svježe kupine', k: 43, g: 150 },
      { n: 'Kućno zamrznute, bez dodataka', k: 43, g: 150 },
      { n: 'Liofilizirane (primjer proizvoda)', k: 330, g: 10 },
      { n: 'Džem (primjer proizvoda)', k: 250, g: 20 },
    ],
    dodatak: { n: 'Šećer', kratko: 'šećer', k: 400 },
    napomena:
      'Vrijednosti su iste kao u tablici: svježe kupine prema bazi USDA, a liofilizirane kupine i džem približno, prema deklaracijama opisanih proizvoda. Šećer se računa sa 400 kcal na 100 g.',
  },

  'naranca-kalorije': {
    tip: 'kalorije',
    naslov: 'Izračunajte kalorije svoje porcije',
    labelStavka: 'Oblik',
    stavke: [
      { n: 'Svježa naranča, bez kore', k: 47, g: 131 },
      { n: 'Kućno smrznuti oguljeni komadi', k: 47, g: 100 },
      { n: '100 % sok s pulpom (primjer proizvoda)', k: 45, g: 200, j: 'ml' },
      { n: 'Napitak s 25 % soka (primjer proizvoda)', k: 44, g: 250, j: 'ml' },
    ],
    napomena:
      'Vrijednosti su iste kao u tablici: naranča prema podacima USDA, a sok i napitak prema deklaracijama opisanih proizvoda. Za druge proizvode prepišite kalorije s deklaracije.',
  },

  'ogrozd-kalorije': {
    tip: 'kalorije',
    naslov: 'Izračunajte kalorije svoje porcije',
    labelStavka: 'Oblik ogrozda',
    stavke: [
      { n: 'Svježi plod', k: 44, g: 150 },
      { n: 'Kućno smrznuti plod, bez dodataka', k: 44, g: 150 },
      { n: 'Džem (primjer proizvoda)', k: 274, g: 20 },
    ],
    dodatak: { n: 'Šećer', kratko: 'šećer', k: 400 },
    napomena:
      'Vrijednosti su iste kao u tablici: plod prema bazi USDA, džem prema deklaraciji opisanog proizvoda, a šećer prema tablici Matvaretabellen (400 kcal na 100 g).',
  },
};
