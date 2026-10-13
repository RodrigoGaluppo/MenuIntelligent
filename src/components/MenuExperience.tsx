"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Locale, Product, Restaurant } from "@/lib/types";
import { LOCALES, categoryNames, money, t, ui } from "@/lib/i18n";
import { VideoCard } from "./VideoCard";
import { ReelViewer } from "./ReelViewer";
import { assetPath } from "@/lib/assets";

const NAV = ["all", "popular", "ritual", "starters", "snacks", "mains", "meat", "seafood", "desserts"];
const editorial = {
  pl: { season: "Karta • wrzesień 2026", title: "Dobre chwile.", italic: "Prawdziwe smaki.", intro: "Rozgość się. Odkrywaj sezonowe dania, dziel się przy stole i znajdź swój ulubiony smak.", explore: "Odkryj kartę", reserve: "Zarezerwuj stolik", our: "Przy naszym stole", heading: "Na co masz ochotę?", note: "Proste składniki. Nieoczywiste połączenia. Przyjemność dzielenia.", ritual: "Wszystko zaczyna się od oliwy.", ritualText: "Ciepły chleb, dobra oliwa i chwila tylko dla siebie. Poznaj rytuał, który jest sercem naszej kuchni.", details: "Poznaj danie", reset: "Wyczyść filtry", visit: "Do zobaczenia przy stole.", visitText: "W samym sercu Wrocławia. Z dobrym jedzeniem, kieliszkiem wina i ludźmi, dla których warto zostać dłużej.", pdf: "Karta w PDF", count: "dań", imageNote: "Wizualizacje dań mają charakter ilustracyjny.", contact: "Kontakt", directions: "Jak do nas trafić", videos: "Tylko z filmem", all: "Wszystkie dania" },
  en: { season: "Menu • September 2026", title: "Good moments.", italic: "Real flavours.", intro: "Make yourself at home. Explore seasonal dishes, share something at the table and find your favourite flavour.", explore: "Explore the menu", reserve: "Book a table", our: "At our table", heading: "What are you in the mood for?", note: "Simple ingredients. Unexpected combinations. The pleasure of sharing.", ritual: "It all starts with olive oil.", ritualText: "Warm bread, beautiful olive oil and a moment to savour. Discover the ritual at the heart of our kitchen.", details: "Discover the dish", reset: "Clear filters", visit: "See you at the table.", visitText: "In the heart of Wrocław. Good food, a glass of wine and people who make you want to stay a little longer.", pdf: "PDF menu", count: "dishes", imageNote: "Dish visualisations are illustrative.", contact: "Contact", directions: "Get directions", videos: "With video", all: "All dishes" },
  uk: { season: "Меню • вересень 2026", title: "Добрі миті.", italic: "Справжні смаки.", intro: "Почувайтеся як удома. Відкривайте сезонні страви, діліться за столом і знаходьте улюблений смак.", explore: "Відкрити меню", reserve: "Забронювати стіл", our: "За нашим столом", heading: "Чого вам хочеться?", note: "Прості інгредієнти. Несподівані поєднання. Задоволення ділитися.", ritual: "Усе починається з олії.", ritualText: "Теплий хліб, добра оливкова олія та мить для себе. Відкрийте ритуал у серці нашої кухні.", details: "Про страву", reset: "Скинути фільтри", visit: "До зустрічі за столом.", visitText: "У серці Вроцлава. Смачна їжа, келих вина та люди, з якими хочеться залишитися довше.", pdf: "Меню PDF", count: "страв", imageNote: "Зображення страв є ілюстративними.", contact: "Контакт", directions: "Як дістатися", videos: "З відео", all: "Усі страви" },
};

export function MenuExperience({ restaurant, products }: { restaurant: Restaurant; products: Product[] }) {
  const [locale, setLocale] = useState<Locale>("pl");
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("all");
  const [videoOnly, setVideoOnly] = useState(false);
  const [reel, setReel] = useState<string | null>(null);
  const closeReel = useCallback(() => setReel(null), []);
  useEffect(() => { document.documentElement.lang = locale; }, [locale]);
  const copy = editorial[locale];
  const available = useMemo(() => products.filter(p => p.available), [products]);
  const visible = useMemo(() => available.filter(p => {
    const match = (t(p.name, locale) + " " + t(p.description, locale)).toLocaleLowerCase().includes(query.trim().toLocaleLowerCase());
    return match && (!videoOnly || !!p.video) && (cat === "all" || (cat === "popular" ? p.featured : p.category === cat));
  }), [available, locale, query, cat, videoOnly]);
  const hero = available.find(p => p.id === "olive-ritual");
  const reset = () => { setQuery(""); setCat("all"); setVideoOnly(false); };
  return (
    <div className="cork-site">
      <a className="skip-link" href="#menu">{copy.explore}</a>
      <div className="topline"><span>WROCŁAW · RZEŹNICZA 32/33</span><a href="tel:+48502198333">+48 502 198 333 ↗</a></div>
      <header className="site-header">
        <a href="#" className="wordmark" aria-label="The Cork">the cork<span>great people. real food.</span></a>
        <nav className="header-links" aria-label={ui[locale].menu}><a href="#menu">{ui[locale].menu}</a><a href="#ritual">{t(categoryNames.ritual, locale)}</a><a href="#visit">{copy.contact}</a></nav>
        <div className="header-actions"><div className="languages" aria-label={ui[locale].language}>{LOCALES.map(l => <button key={l.id} aria-pressed={locale === l.id} onClick={() => setLocale(l.id)}>{l.label}</button>)}</div><a className="reservation" href="tel:+48502198333">{copy.reserve} <span>↗</span></a></div>
      </header>

      <section className="hero">
        <div className="hero-copy"><p className="eyebrow"><span className="small-line" />{copy.season}</p><h1>{copy.title}<br /><em>{copy.italic}</em></h1><p className="hero-intro">{copy.intro}</p><a className="solid-link" href="#menu">{copy.explore}<span>↓</span></a><div className="hero-signature"><span className="signature-seal">C</span><span>THE CORK<br /><small>R32 · WROCŁAW</small></span><span className="signature-line" /></div></div>
        <div className="hero-picture">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={assetPath("/media/posters/olive-ritual.jpg")} alt={hero ? t(hero.name, locale) : "The Cork"} fetchPriority="high" />
          <div className="photo-caption"><span>01 / THE CORK</span><span>great people. real food.</span></div>
          {hero && <button className="hero-dish" onClick={() => setReel(hero.id)}><span><small>{t(categoryNames.ritual, locale)}</small>{t(hero.name, locale)}</span><span>{money(hero.price)} <b>↗</b></span></button>}
        </div>
      </section>

      <div className="manifesto"><span>{locale === "pl" ? "SEZONOWOŚĆ" : locale === "en" ? "SEASONAL FLAVOURS" : "СЕЗОННІ СМАКИ"}</span><i>✳</i><span>REAL FOOD</span><i>✳</i><span>GREAT PEOPLE</span><i>✳</i><span>THE CORK · WROCŁAW</span></div>

      <main id="menu" className="menu-section">
        <div className="section-heading"><div><p className="eyebrow">{copy.our}</p><h2>{copy.heading}</h2><p>{copy.note}</p></div><a className="text-link" href={assetPath("/menu-september-2026.pdf")} target="_blank" rel="noreferrer">{copy.pdf} ↗</a></div>
        <div className="menu-toolbar"><div className="category-nav no-scrollbar" role="group" aria-label={ui[locale].menu}>{NAV.filter(id => id === "all" || id === "popular" || available.some(p => p.category === id)).map(id => <button key={id} aria-pressed={cat === id} onClick={() => setCat(id)}>{t(categoryNames[id], locale)}{id === "all" && <sup>{available.length}</sup>}</button>)}</div>
        <div className="search-row"><label className="search-field"><span aria-hidden="true">⌕</span><input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder={ui[locale].search} aria-label={ui[locale].search} /></label><label className="video-filter"><input type="checkbox" checked={videoOnly} onChange={e => setVideoOnly(e.target.checked)} />{copy.videos}</label><span className="result-count" aria-live="polite">{visible.length} {copy.count}</span></div></div>
        <div className="dish-grid">{visible.map(p => <VideoCard key={p.id} product={p} locale={locale} onOpen={setReel} />)}</div>
        {!visible.length && <div className="empty-state"><h3>{ui[locale].empty}</h3><button className="solid-link" onClick={reset}>{copy.reset} ↗</button></div>}
        <p className="image-note">{copy.imageNote}</p><p className="service-note">{locale === "pl" ? "Ceny zawierają VAT. Dla grup od 6 osób doliczamy 10% serwisu. O alergeny i gramaturę składników zapytaj obsługę." : locale === "en" ? "Prices include VAT. A 10% service charge applies to groups of 6 or more. Ask our team about allergens and individual ingredient weights." : "Ціни включають ПДВ. Для груп від 6 осіб додається 10% за обслуговування. Про алергени та вагу інгредієнтів запитайте персонал."}</p>
      </main>

      {hero && <section id="ritual" className="ritual-section"><div className="ritual-photo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={assetPath("/media/posters/ritual-reference.png")} alt={t(hero.name, locale)} loading="lazy" />
      </div><div className="ritual-copy"><p className="eyebrow">THE CORK · {t(categoryNames.ritual, locale)}</p><h2>{copy.ritual}</h2><p>{copy.ritualText}</p><button className="outline-link" onClick={() => setReel(hero.id)}>{copy.details}<span>↗</span></button><span className="ritual-number">01</span></div></section>}

      <section id="visit" className="visit-section"><div><p className="eyebrow">GREAT PEOPLE. REAL FOOD.</p><h2>{copy.visit}</h2><p>{copy.visitText}</p><a className="solid-link" href="tel:+48502198333">{copy.reserve} ↗</a></div><div className="visit-details"><h3>The Cork</h3><p>{t(restaurant.address, locale)}</p><a className="text-link" href="https://www.google.com/maps/search/?api=1&query=The+Cork+Rzeznicza+32+Wroclaw" target="_blank" rel="noreferrer">{copy.directions} ↗</a><hr /><p>{t(restaurant.hours, locale)}</p><a href="tel:+48502198333">{restaurant.phone}</a><a href="mailto:thecorkr32@thecork.pl">thecorkr32@thecork.pl</a></div><div className="visit-photo">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={assetPath("/media/posters/interior-reference.png")} alt="The Cork · Wrocław" loading="lazy" /></div></section>
      <footer className="site-footer"><a className="wordmark" href="#">the cork<span>great people. real food.</span></a><span>{copy.season} · R32 Wrocław</span><a href="https://thecork.pl" target="_blank" rel="noreferrer">thecork.pl ↗</a></footer>
      {reel && <ReelViewer products={visible.some(p => p.id === reel) ? visible : available} startId={reel} locale={locale} onClose={closeReel} />}
    </div>
  );
}
