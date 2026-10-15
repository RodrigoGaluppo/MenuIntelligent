"use client";

import { useMemo, useRef, useState } from "react";
import type { CategoryId, Locale, Product, Restaurant } from "@/lib/types";
import { LOCALES, categoryNames, t, ui } from "@/lib/i18n";
import { Icon } from "./Icons";
import { VideoCard } from "./VideoCard";
import { ReelViewer } from "./ReelViewer";

const CATEGORIES: CategoryId[] = ["ritual", "starters", "snacks", "mains", "meat", "seafood", "desserts"];
const guestCopy: Record<Locale, { wifi: string; wifiHelp: string; menu: string; waiter: string; reviews: string; back: string; network: string; password: string; categories: string; search: string }> = {
  pl: { wifi: "Wi-Fi", wifiHelp: "Poproś obsługę o aktualną nazwę sieci i hasło.", menu: "Zobacz menu", waiter: "Zadzwoń do nas", reviews: "Opinie Google", back: "Wróć", network: "Sieć", password: "Hasło", categories: "Kategorie", search: "Szukaj w menu" },
  en: { wifi: "Wi-Fi", wifiHelp: "Ask our team for the current network name and password.", menu: "Explore the menu", waiter: "Call us", reviews: "Google reviews", back: "Back", network: "Network", password: "Password", categories: "Categories", search: "Search the menu" },
  uk: { wifi: "Wi-Fi", wifiHelp: "Запитайте персонал про назву мережі та пароль.", menu: "Переглянути меню", waiter: "Зателефонувати", reviews: "Відгуки Google", back: "Назад", network: "Мережа", password: "Пароль", categories: "Категорії", search: "Пошук у меню" },
};

export function MenuExperience({ restaurant, products }: { restaurant: Restaurant; products: Product[] }) {
  const [locale, setLocale] = useState<Locale>("pl");
  const [screen, setScreen] = useState<"welcome" | "menu">("welcome");
  const [wifiOpen, setWifiOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [openCategories, setOpenCategories] = useState<CategoryId[]>(["ritual"]);
  const [reel, setReel] = useState<{ id: string; category: CategoryId } | null>(null);
  const searchInput = useRef<HTMLInputElement>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLocaleLowerCase();
    return products.filter((product) => product.available && (!q ||
      (t(product.name, locale) + " " + t(product.description, locale) + " " + t(product.ingredients, locale)).toLocaleLowerCase().includes(q)));
  }, [products, query, locale]);
  const sections = useMemo(() => CATEGORIES
    .map((category) => ({ category, products: visible.filter((product) => product.category === category) }))
    .filter((section) => section.products.length > 0), [visible]);

  const copy = ui[locale];
  const guest = guestCopy[locale];
  const reviewsUrl = "https://www.google.com/maps/search/?api=1&query=The+Cork+R32+Rzeznicza+32%2F33+Wroclaw";
  const phoneUrl = "tel:" + restaurant.phone.replace(/\s+/g, "");
  const scrollBehavior = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" as const : "smooth" as const;

  function enterMenu() {
    setScreen("menu");
    window.scrollTo({ top: 0, behavior: scrollBehavior() });
  }

  function changeQuery(value: string) {
    setQuery(value);
    const q = value.trim().toLocaleLowerCase();
    setOpenCategories(q ? CATEGORIES.filter((category) => products.some((product) =>
      product.available && product.category === category &&
      (t(product.name, locale) + " " + t(product.description, locale) + " " + t(product.ingredients, locale)).toLocaleLowerCase().includes(q))) : ["ritual"]);
  }

  function toggleCategory(category: CategoryId) {
    const opening = !openCategories.includes(category);
    setOpenCategories((current) => opening ? [...current, category] : current.filter((item) => item !== category));
    if (opening) requestAnimationFrame(() => document.getElementById("category-" + category)?.scrollIntoView({ behavior: scrollBehavior(), block: "start" }));
  }

  return <div className="guest-app">
    {screen === "welcome" ? <main className="welcome-screen screen-enter">
      <header className="welcome-top">
        <span className="eyebrow">R32 · WROCŁAW</span>
        <div className="language-switch" role="group" aria-label={copy.language}>
          {LOCALES.map((language) => <button key={language.id} type="button" aria-pressed={locale === language.id} onClick={() => setLocale(language.id)}>{language.label}</button>)}
        </div>
      </header>
      <section className="welcome-content">
        <div className="brand-mark" aria-label="THE CORK">
          <span className="brand-line" />
          <h1>THE CORK</h1>
          <p>{restaurant.tagline.en}</p>
        </div>
        <p className="welcome-address">{t(restaurant.address, locale)}</p>
        <nav className="guest-actions" aria-label={copy.menu}>
          <button className="guest-action guest-action-primary" type="button" onClick={enterMenu}>
            <span className="action-icon"><Icon name="menu" /></span><span className="action-label">{guest.menu}</span><Icon className="action-trail" name="external" />
          </button>
          <button className="guest-action" type="button" aria-expanded={wifiOpen} onClick={() => setWifiOpen((open) => !open)}>
            <span className="action-icon"><Icon name="wifi" /></span><span className="action-label">{guest.wifi}</span><Icon className={"action-trail " + (wifiOpen ? "is-open" : "")} name="chevron" />
          </button>
          {wifiOpen && <div className="wifi-details">
            {restaurant.wifiName && <p><span>{guest.network}</span><strong>{restaurant.wifiName}</strong></p>}
            {restaurant.wifiPassword && <p><span>{guest.password}</span><strong>{restaurant.wifiPassword}</strong></p>}
            {(!restaurant.wifiName || !restaurant.wifiPassword) && <p>{guest.wifiHelp}</p>}
          </div>}
          <a className="guest-action" href={phoneUrl}><span className="action-icon"><Icon name="phone" /></span><span className="action-label">{guest.waiter}</span><Icon className="action-trail" name="external" /></a>
          <a className="guest-action" href={reviewsUrl} target="_blank" rel="noopener noreferrer"><span className="action-icon"><Icon name="star" /></span><span className="action-label">{guest.reviews}</span><Icon className="action-trail" name="external" /></a>
        </nav>
      </section>
      <footer className="welcome-footer"><span>THE CORK · R32</span><a href="https://thecork.pl" target="_blank" rel="noopener noreferrer">THECORK.PL</a></footer>
    </main> : <main className="menu-screen screen-enter">
      <header className="menu-header">
        <button type="button" className="icon-button back-button" onClick={() => { setScreen("welcome"); setWifiOpen(false); window.scrollTo({ top: 0, behavior: scrollBehavior() }); }} aria-label={guest.back}><Icon name="back" /></button>
        <div className="menu-brand">THE CORK<span>R32 · WROCŁAW</span></div>
        <div className="menu-tools">
          <div className="language-switch" role="group" aria-label={copy.language}>{LOCALES.map((language) => <button key={language.id} type="button" aria-pressed={locale === language.id} onClick={() => setLocale(language.id)}>{language.label}</button>)}</div>
          <button type="button" className="icon-button search-toggle" aria-label={guest.search} aria-expanded={searchOpen} onClick={() => { setSearchOpen((open) => !open); if (!searchOpen) requestAnimationFrame(() => searchInput.current?.focus()); else changeQuery(""); }}><Icon name={searchOpen ? "close" : "search"} /></button>
        </div>
      </header>
      {searchOpen && <div className="search-panel"><Icon name="search" /><input ref={searchInput} value={query} onChange={(event) => changeQuery(event.target.value)} placeholder={copy.search} aria-label={guest.search} type="search" /></div>}
      <div className="menu-intro"><span className="eyebrow">THE CORK / R32</span><h1>{copy.menu}</h1><span className="menu-intro-count">{String(visible.length).padStart(2, "0")}</span></div>
      <section className="menu-sections" aria-label={guest.categories}>
        {sections.length === 0 ? <p className="menu-empty">{copy.empty}</p> : sections.map(({ category, products: categoryProducts }, index) => {
          const open = openCategories.includes(category);
          return <section className="menu-category" id={"category-" + category} key={category}>
            <h2><button type="button" className="category-trigger" aria-expanded={open} aria-controls={"panel-" + category} onClick={() => toggleCategory(category)}>
              <span className="category-number">{String(index + 1).padStart(2, "0")}</span><span className="category-name">{t(categoryNames[category], locale)}</span><span className="category-count">{String(categoryProducts.length).padStart(2, "0")}</span><Icon name="chevron" className="category-chevron" />
            </button></h2>
            <div className={"category-panel " + (open ? "is-open" : "")} id={"panel-" + category} aria-hidden={!open}>
              <div className="category-panel-inner"><div className="dish-grid">{open && categoryProducts.map((product) => <VideoCard key={product.id} product={product} locale={locale} onOpen={() => setReel({ id: product.id, category })} />)}</div></div>
            </div>
          </section>;
        })}
      </section>
      <footer className="menu-footer">THE CORK · R32 · WROCŁAW</footer>
    </main>}
    {reel && <ReelViewer products={visible.filter((product) => product.category === reel.category)} startId={reel.id} locale={locale} onClose={() => setReel(null)} />}
  </div>;
}
