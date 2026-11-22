/**
 * Oznake (hashtagovi) članaka.
 * U frontmatteru članka upisuje se ključ (npr. `tags: [aronija, recepti]`).
 * Stranica /tema/<ključ>/ nastaje za biljku s barem 2 članka, a za temu s barem 3 (minArticles).
 */
export const MIN_ARTICLES = 3;
/** Biljke dobivaju stranicu već od 2 članka (teme od 3). */
export const MIN_PLANT_ARTICLES = 2;

export type TagGroup = 'biljka' | 'tema';

export interface TagDef {
  /** tekst hashtaga bez # (s kvačicama) */
  hash: string;
  /** naziv teme za naslov stranice */
  name: string;
  group: TagGroup;
  metaTitle: string;
  metaDescription: string;
  intro: string;
}

export const TAGS: Record<string, TagDef> = {
  rajcica: {
    hash: 'rajčica', name: 'Rajčica', group: 'biljka',
    metaTitle: 'Rajčica: sadnja, uzgoj u tegli, sorte i kalorije',
    metaDescription: 'Svi članci o rajčici na jednom mjestu: razmak sadnje, uzgoj u teglama, zalijevanje, vršna trulež, najukusnije sorte, dobri susjedi i kalorije.',
    intro: 'Rajčica je najčešće povrće u našim vrtovima i na balkonima, ali traži dovoljno mjesta, redovito zalijevanje i dobar izbor sorte. Ovdje su svi naši članci o rajčici, od razmaka sadnje i uzgoja u teglama do vršne truleži, sorti i kalorija.',
  },
  'crni-ribiz': {
    hash: 'crni-ribiz', name: 'Crni ribiz', group: 'biljka',
    metaTitle: 'Crni ribiz: uzgoj, berba, ljekovitost i recepti',
    metaDescription: 'Članci o crnom ribizu: sadnja i rezidba, berba, sastav i vitamin C, željezo, kalorije, recepti i domaće kapi od crnog ribiza.',
    intro: 'Crni ribiz bogat je vitaminom C, lako se uzgaja u vrtu, a od bobica se rade sokovi, džemovi i kapi. Na ovoj stranici pronaći ćete naše članke o sadnji, rezidbi i berbi crnog ribiza, njegovu sastavu i receptima.',
  },
  kamilica: {
    hash: 'kamilica', name: 'Kamilica', group: 'biljka',
    metaTitle: 'Kamilica: uzgoj, berba, sušenje i čaj od kamilice',
    metaDescription: 'Svi članci o kamilici: sadnja u vrtu i tegli, branje i sušenje, čaj i hladni oblozi te kada je potreban oprez, osobito kod beba.',
    intro: 'Kamilica je jedna od najpoznatijih ljekovitih biljaka, a lako se uzgaja i u vrtu i u tegli na balkonu. Ovdje su naši članci o sadnji, berbi i sušenju kamilice, čaju i oblozima te o tome kada je potreban oprez, osobito kod beba.',
  },
  aronija: {
    hash: 'aronija', name: 'Aronija', group: 'biljka',
    metaTitle: 'Aronija: sok, pekmez, zamrzavanje, kalorije i nuspojave',
    metaDescription: 'Članci o aroniji: domaći sok, pekmez i zamrzavanje bobica, kalorije, sastav te moguće nuspojave soka i kome je potreban oprez.',
    intro: 'Aronija je trpka tamna bobica koja se rijetko jede svježa, a najčešće se cijedi u sok, zamrzava ili kuha u pekmez. Na ovoj stranici su naši članci o sastavu i kalorijama aronije, mogućim nuspojavama soka i domaćoj preradi.',
  },
  ogrozd: {
    hash: 'ogrozd', name: 'Ogrozd', group: 'biljka',
    metaTitle: 'Ogrozd: sadnja, sorte, rezidba, zdravlje i recepti',
    metaDescription: 'Svi članci o ogrozdu: sadnja i razmnožavanje, sorte, rezidba grma, sastav i istraživanja, kalorije i recepti s ogrozdom.',
    intro: 'Ogrozd je nekad rastao u gotovo svakom vrtu, a danas ga mnogi iznova otkrivaju. Ovdje su naši članci o sadnji, sortama i rezidbi ogrozda, njegovu sastavu, kalorijama i receptima.',
  },
  eukaliptus: {
    hash: 'eukaliptus', name: 'Eukaliptus', group: 'biljka',
    metaTitle: 'Eukaliptus: uzgoj u tegli, vrste, buketi i otrovnost',
    metaDescription: 'Članci o eukaliptusu: uzgoj u tegli, vrste, suhi buketi, limunski eukaliptus protiv komaraca i zašto je ulje opasno za djecu i ljubimce.',
    intro: 'Eukaliptus se kod nas uzgaja kao ukrasna biljka u tegli, a njegove su grane sve češće u suhim buketima. Ovdje su članci o uzgoju i vrstama eukaliptusa, limunskom eukaliptusu protiv komaraca te o tome zašto je njegovo eterično ulje opasno za djecu i kućne ljubimce.',
  },
  menta: {
    hash: 'menta', name: 'Menta', group: 'biljka',
    metaTitle: 'Menta: uzgoj u tegli, berba, sušenje, čaj i sok',
    metaDescription: 'Svi članci o menti: uzgoj u tegli, berba i sušenje, čaj od mente i njegovo djelovanje, sok od mente te kada je potreban oprez.',
    intro: 'Menta brzo raste u tegli i u vrtu, a od njezinih listova priprema se čaj i osvježavajući sok. Na ovoj stranici su naši članci o uzgoju, berbi i sušenju mente, čaju od mente i tome kada s njim treba biti oprezan.',
  },
  bazga: {
    hash: 'bazga', name: 'Bazga', group: 'biljka',
    metaTitle: 'Bazga (zova): cvijet, bobice, čaj i kalorije',
    metaDescription: 'Članci o crnoj bazgi: cvijet i bobice, čaj od bazge i doziranje, kalorije soka i sirupa te zašto se bobice ne jedu sirove.',
    intro: 'Crna bazga, u mnogim krajevima poznata kao zova, cvate krajem proljeća, a bobice sazrijevaju krajem ljeta. Ovdje su naši članci o cvijetu i bobicama bazge, čaju i kalorijama te o tome zašto se bobice ne jedu sirove.',
  },
  mrkva: {
    hash: 'mrkva', name: 'Mrkva', group: 'biljka',
    metaTitle: 'Mrkva: sadnja, susjedi u vrtu, zdravlje i kalorije',
    metaDescription: 'Članci o mrkvi: sjetva i uzgoj, dobri i loši susjedi u vrtu, zaštita od mrkvine muhe, sastav i kalorije sirove, kuhane i pečene mrkve.',
    intro: 'Mrkva se sije izravno u vrt, a uz dobro odabrane susjede i zaštitu od mrkvine muhe daje lijep urod. Na ovoj stranici su naši članci o uzgoju, sastavu i kalorijama mrkve.',
  },
  naranca: {
    hash: 'naranča', name: 'Naranča', group: 'biljka',
    metaTitle: 'Naranča: vitamin C, kalorije ploda i soka, zablude',
    metaDescription: 'Članci o naranči: sastav i vitamin C, kalorije ploda i čaše soka te zašto boja kore ne govori je li naranča zrela.',
    intro: 'Naranča je zimsko voće uz koje mnogi najprije pomisle na vitamin C. Ovdje su naši članci o njezinu sastavu, kalorijama ploda i soka te čestim zabludama o zrelosti naranči.',
  },
  'plave-zone': {
    hash: 'plave-zone', name: 'Plave zone', group: 'biljka',
    metaTitle: 'Plave zone: Okinawa, Sardinija, Ikaria, Nicoya, Loma Linda',
    metaDescription: 'Što su jeli i kako su živjeli ljudi u plavim zonama, područjima neobično duga života, i što stvarno stoji iza priče o dugovječnosti.',
    intro: 'Plave zone su područja u kojima ljudi žive dulje od prosjeka: Okinawa, Sardinija, Ikaria, Nicoya i Loma Linda. Ovdje su naši članci o tome što su ondje jeli, kako su živjeli i što stvarno stoji iza priče o dugovječnosti.',
  },
  kadulja: {
    hash: 'kadulja', name: 'Kadulja', group: 'biljka',
    metaTitle: 'Kadulja: uzgoj, čaj i ljekovitost',
    metaDescription: 'Članci o kadulji: uzgoj u vrtu i tegli, priprema čaja, što istraživanja kažu o ljekovitosti te dobne granice i oprez s eteričnim uljem.',
    intro: 'Ljekovita kadulja raste na suhim, sunčanim mjestima uz jadransku obalu, a njezin se list stoljećima koristi za čaj i grgljanje. Ovdje su naši članci o uzgoju kadulje, čaju i tome što istraživanja doista pokazuju o njezinoj ljekovitosti.',
  },
  'majcina-dusica': {
    hash: 'majčina-dušica', name: 'Majčina dušica', group: 'biljka',
    metaTitle: 'Majčina dušica: čaj, uzgoj i ljekovitost',
    metaDescription: 'Članci o majčinoj dušici: uzgoj, priprema čaja, ljekovitost, razlika prema timijanu te kada je potreban oprez, osobito kod djece.',
    intro: 'Majčina dušica niska je mirisna biljka koja voli sunce i suho, kamenito tlo, a od njezinih cvjetnih vršaka priprema se čaj. Ovdje su naši članci o uzgoju, čaju i ljekovitosti majčine dušice te o tome po čemu se razlikuje od timijana.',
  },
  ruzmarin: {
    hash: 'ružmarin', name: 'Ružmarin', group: 'biljka',
    metaTitle: 'Ružmarin: sadnja, čaj i ulje',
    metaDescription: 'Članci o ružmarinu: sadnja i uzgoj, priprema čaja i ulja s ružmarinom, sastav te mjere opreza za djecu, trudnice i kod epilepsije.',
    intro: 'Ružmarin je zimzeleni mediteranski grm koji uz sunce i propusno tlo godinama raste u vrtu ili tegli. Ovdje su naši članci o sadnji, čaju i ulju od ružmarina te mjerama opreza.',
  },
  kupina: {
    hash: 'kupina', name: 'Kupina', group: 'biljka',
    metaTitle: 'Kupina: sadnja, uzgoj, ljekovitost i kalorije',
    metaDescription: 'Članci o kupini: sadnja i uzgoj u vrtu, sastav i ljekovitost te kalorije svježih, zamrznutih i sušenih kupina i džema od kupina.',
    intro: 'Kupina raste divlje uz rubove šuma, a vrtne sorte, od kojih su mnoge bez trnja, daju krupnije plodove. Ovdje su naši članci o sadnji i uzgoju kupine, njezinu sastavu i kalorijama svježih, zamrznutih i sušenih kupina te džema.',
  },
  ginko: {
    hash: 'ginko', name: 'Ginko', group: 'biljka',
    metaTitle: 'Ginko: uzgoj, rast stabla i ljekovitost',
    metaDescription: 'Članci o ginku (Ginkgo biloba): uzgoj i brzina rasta stabla, ljekovitost prema EMA-i i istraživanjima te tko ne smije uzimati ginko.',
    intro: 'Ginko je drvo vrlo duge povijesti koje se kod nas sadi u parkovima i vrtovima, a ekstrakt njegova lista koristi se kao biljni lijek. Ovdje su naši članci o uzgoju i rastu ginka te o tome što istraživanja pokazuju o njegovu djelovanju i kome može naškoditi.',
  },
  uzgoj: {
    hash: 'uzgoj', name: 'Uzgoj i njega', group: 'tema',
    metaTitle: 'Uzgoj i njega: sadnja, tegle, rezidba i berba',
    metaDescription: 'Vodiči za sadnju, uzgoj u teglama, zalijevanje, rezidbu i berbu povrća, voća i bilja, provjereni prema savjetima stručnih vrtlarskih službi.',
    intro: 'Dobar urod počinje pravim mjestom, tlom i zalijevanjem. Ovdje su svi naši vodiči za sadnju, uzgoj u teglama, rezidbu i berbu povrća, voća i bilja, provjereni prema savjetima stručnih vrtlarskih službi.',
  },
  zdravlje: {
    hash: 'zdravlje', name: 'Zdravlje i ljekovitost', group: 'tema',
    metaTitle: 'Zdravlje i ljekovitost biljaka: što kažu istraživanja',
    metaDescription: 'Što istraživanja doista pokazuju o ljekovitosti voća, povrća i bilja, kome je potreban oprez i kada se treba javiti liječniku.',
    intro: 'Mnoge biljke iz vrta tradicionalno se koriste za zdravlje, ali dokazi o njihovu djelovanju nisu jednako čvrsti. U ovim člancima navodimo što istraživanja doista pokazuju, kome je potreban oprez i kada se treba javiti liječniku.',
  },
  recepti: {
    hash: 'recepti', name: 'Recepti i priprema', group: 'tema',
    metaTitle: 'Recepti: sokovi, pekmezi, sirupi i domaće kapi',
    metaDescription: 'Recepti i postupci domaće pripreme od bobica i bilja: sokovi, pekmezi, sirupi i kapi, s točnim količinama i savjetima za sigurno čuvanje.',
    intro: 'Od bobica i bilja iz vrta mogu se pripremiti sokovi, pekmezi, sirupi i kapi. Ovdje su naši recepti i postupci domaće pripreme, s točnim količinama i savjetima za sigurno čuvanje.',
  },
  cajevi: {
    hash: 'čajevi', name: 'Čajevi', group: 'tema',
    metaTitle: 'Biljni čajevi: kamilica, menta, majčina dušica, bazga',
    metaDescription: 'Kako pripremiti i osušiti bilje za čaj, što čajevi od kamilice, mente, majčine dušice i bazge mogu, a što ne, te dobne granice i oprez.',
    intro: 'Biljni čaj najjednostavniji je način da iskoristite bilje iz vrta. Ovdje su naši članci o pripremi, sušenju i djelovanju čajeva od kamilice, mente, majčine dušice, bazge i drugog bilja, uz dobne granice i mjere opreza.',
  },
  kalorije: {
    hash: 'kalorije', name: 'Kalorije', group: 'tema',
    metaTitle: 'Kalorije voća i povrća: svježe, sok, džem i sušeno',
    metaDescription: 'Koliko kalorija imaju aronija, ribiz, ogrozd, kupine, naranča, bazga, rajčica i mrkva: po 100 g i po porciji, svježe, kao sok, džem ili sušeno.',
    intro: 'Kalorije voća i povrća ovise o obliku u kojem ih jedete: svježem, sušenom, kao sok ili džem. U ovim člancima donosimo provjerene vrijednosti po porciji i na 100 g, s jasnim primjerima računa.',
  },
};

/** Oznake članka koje postoje u popisu, redom kako su upisane. */
export function knownTags(tags: string[] = []): string[] {
  return tags.filter(t => t in TAGS);
}

export const tagPath = (key: string) => `/tema/${key}/`;

/** Najmanji broj članaka da oznaka dobije vlastitu stranicu. */
export function minArticles(key: string): number {
  return TAGS[key]?.group === 'biljka' ? MIN_PLANT_ARTICLES : MIN_ARTICLES;
}

/** Kratki natpis oznake za gumbe i tabove, npr. "Crni ribiz", "Uzgoj", "Čajevi". */
export function tagLabel(key: string): string {
  const h = TAGS[key]?.hash ?? key;
  const s = h.replace(/-/g, ' ');
  return s.charAt(0).toLocaleUpperCase('hr') + s.slice(1);
}
