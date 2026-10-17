import type { Locale, Localized } from "./types";

export const LOCALES: { id: Locale; label: string }[] = [
  { id: "pl", label: "PL" },
  { id: "en", label: "EN" },
  { id: "uk", label: "УКР" },
];

export const ui: Record<
  Locale,
  {
    search: string;
    watchDish: string;
    watchReel: string;
    menu: string;
    popular: string;
    close: string;
    share: string;
    favorite: string;
    pause: string;
    play: string;
    ingredients: string;
    allergens: string;
    price: string;
    available: string;
    unavailable: string;
    demo: string;
    admin: string;
    language: string;
    googleTranslate: string;
    featured: string;
    all: string;
    empty: string;
    wifi: string;
    hours: string;
  }
> = {
  pl: {
    search: "Szukaj dań",
    watchDish: "Obejrzyj danie",
    watchReel: "Reel",
    menu: "Karta",
    popular: "Popularne",
    close: "Zamknij",
    share: "Udostępnij",
    favorite: "Ulubione",
    pause: "Pauza",
    play: "Odtwórz",
    ingredients: "Składniki",
    allergens: "Alergeny",
    price: "Cena",
    available: "Dostępne",
    unavailable: "Niedostępne",
    demo: "The Cork R32 — karta wrzesień 2026 · Wrocław",
    admin: "Panel",
    language: "Język",
    googleTranslate: "Google Translate",
    featured: "Rytuał",
    all: "Wszystko",
    empty: "Brak pozycji w tej kategorii.",
    wifi: "Wi‑Fi gości",
    hours: "Godziny",
  },
  en: {
    search: "Search dishes",
    watchDish: "Watch dish",
    watchReel: "Reel",
    menu: "Menu",
    popular: "Popular",
    close: "Close",
    share: "Share",
    favorite: "Favorite",
    pause: "Pause",
    play: "Play",
    ingredients: "Ingredients",
    allergens: "Allergens",
    price: "Price",
    available: "Available",
    unavailable: "Unavailable",
    demo: "The Cork R32 — September 2026 menu · Wrocław",
    admin: "Admin",
    language: "Language",
    googleTranslate: "Google Translate",
    featured: "Ritual",
    all: "All",
    empty: "Nothing in this category yet.",
    wifi: "Guest Wi‑Fi",
    hours: "Hours",
  },
  uk: {
    search: "Шукати страви",
    watchDish: "Дивитися страву",
    watchReel: "Reel",
    menu: "Меню",
    popular: "Популярне",
    close: "Закрити",
    share: "Поділитися",
    favorite: "Улюблене",
    pause: "Пауза",
    play: "Відтворити",
    ingredients: "Інгредієнти",
    allergens: "Алергени",
    price: "Ціна",
    available: "Доступно",
    unavailable: "Недоступно",
    demo: "The Cork R32 — меню вересень 2026 · Вроцлав",
    admin: "Адмін",
    language: "Мова",
    googleTranslate: "Google Translate",
    featured: "Ритуал",
    all: "Усе",
    empty: "У цій категорії поки немає позицій.",
    wifi: "Гостьовий Wi‑Fi",
    hours: "Години",
  },
};

export const categoryNames: Record<string, Localized> = {
  all: { pl: "Wszystko", en: "All", uk: "Усе" },
  popular: { pl: "Popularne", en: "Popular", uk: "Популярне" },
  ritual: { pl: "Rytuał oliwy", en: "Olive ritual", uk: "Ритуал олії" },
  starters: { pl: "Na początek", en: "For the beginning", uk: "На початок" },
  snacks: { pl: "Przekąski", en: "Snacks", uk: "Закуски" },
  mains: { pl: "Dania główne", en: "Mains", uk: "Основні" },
  meat: { pl: "Mięso", en: "Meat", uk: "М'ясо" },
  seafood: { pl: "Ryby i morze", en: "Fish & sea", uk: "Риба і море" },
  desserts: { pl: "Desery", en: "Desserts", uk: "Десерти" },
};

export function t(loc: Localized, locale: Locale) {
  return loc[locale] || loc.en;
}

export function money(price: number, currency = "PLN") {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}
