"use client";

import { useMemo, useState } from "react";
import type { Locale, Product, Restaurant } from "@/lib/types";
import { LOCALES, categoryNames, t, ui } from "@/lib/i18n";
import { VideoCard } from "./VideoCard";
import { ReelViewer } from "./ReelViewer";
import { GoogleTranslate } from "./GoogleTranslate";

const NAV = ["all", "popular", "ritual", "starters", "snacks", "mains", "meat", "seafood", "desserts"] as const;
const guestCopy: Record<Locale, { wifi: string; wifiHelp: string; menu: string; waiter: string; reviews: string; back: string; network: string; password: string }> = {
  pl: { wifi: "Dane Wi-Fi", wifiHelp: "Poproś obsługę o aktualną nazwę sieci i hasło.", menu: "Przejdź do karty", waiter: "Zawołaj obsługę", reviews: "Opinie Google", back: "Wróć", network: "Sieć", password: "Hasło" },
  en: { wifi: "Wi-Fi details", wifiHelp: "Ask our team for the current network name and password.", menu: "Go to menu", waiter: "Call a waiter", reviews: "Google reviews", back: "Back", network: "Network", password: "Password" },
  uk: { wifi: "Дані Wi-Fi", wifiHelp: "Запитайте персонал про назву мережі та пароль.", menu: "Перейти до меню", waiter: "Покликати офіціанта", reviews: "Відгуки Google", back: "Назад", network: "Мережа", password: "Пароль" },
};

export function MenuExperience({ restaurant, products }: { restaurant: Restaurant; products: Product[] }) {
  const [locale, setLocale] = useState<Locale>("pl");
  const [screen, setScreen] = useState<"welcome" | "menu">("welcome");
  const [wifiOpen, setWifiOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [reel, setReel] = useState<string | null>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLocaleLowerCase();
    return products.filter((product) => {
      if (!product.available) return false;
      const haystack = (t(product.name, locale) + " " + t(product.description, locale)).toLocaleLowerCase();
      if (q && !haystack.includes(q)) return false;
      if (cat === "popular") return product.featured;
      return cat === "all" || product.category === cat;
    });
  }, [products, query, cat, locale]);
  const copy = ui[locale];
  const guest = guestCopy[locale];
  const reviewsUrl = "https://www.google.com/maps/search/?api=1&query=The+Cork+R32+Rzeznicza+32%2F33+Wroclaw";
  const phoneUrl = "tel:" + restaurant.phone.replace(/\s+/g, "");

  return (
    <div className="guest-app">
      {screen === "welcome" ? (
        <main className="welcome-screen">
          <div className="welcome-top">
            <span>{restaurant.city.pl.toUpperCase()}</span>
            <div className="language-switch" role="group" aria-label={copy.language}>
              {LOCALES.map((language) => (
                <button key={language.id} type="button" aria-pressed={locale === language.id} onClick={() => setLocale(language.id)}>{language.label}</button>
              ))}
            </div>
          </div>
          <section className="welcome-content">
            <a className="welcome-logo" href="#" aria-label="The Cork">the cork<span>great people. real food.</span></a>
            <p className="welcome-address">{restaurant.address.pl}</p>
            <nav className="guest-actions" aria-label={copy.menu}>
              <button className="guest-action" type="button" onClick={() => setWifiOpen((open) => !open)}>
                <span>{guest.wifi}</span><span className="guest-arrow">{wifiOpen ? "−" : "+"}</span>
              </button>
              {wifiOpen && (
                <div className="wifi-details" aria-live="polite">
                  {restaurant.wifiName && <p><span>{guest.network}</span><strong>{restaurant.wifiName}</strong></p>}
                  {restaurant.wifiPassword && <p><span>{guest.password}</span><strong>{restaurant.wifiPassword}</strong></p>}
                  {(!restaurant.wifiName || !restaurant.wifiPassword) && <p>{guest.wifiHelp}</p>}
                </div>
              )}
              <button className="guest-action guest-menu" type="button" onClick={() => { setCat("all"); setQuery(""); setScreen("menu"); }}>
                <span>{guest.menu}</span><span className="guest-arrow">↗</span>
              </button>
              <a className="guest-action" href={phoneUrl}>
                <span>{guest.waiter}</span><span className="guest-arrow">↗</span>
              </a>
              <a className="guest-action" href={reviewsUrl} target="_blank" rel="noreferrer">
                <span>{guest.reviews}</span><span className="guest-arrow">↗</span>
              </a>
            </nav>
          </section>
          <footer className="welcome-footer"><span>R32 · WROCŁAW</span><a href="https://thecork.pl" target="_blank" rel="noreferrer">THECORK.PL</a></footer>
        </main>
      ) : (
        <main className="menu-screen">
          <div className="menu-controls">
            <button type="button" className="menu-back" onClick={() => { setScreen("welcome"); setWifiOpen(false); }} aria-label={guest.back}>← <span>{guest.back}</span></button>
            <label className="search-box">
              <span aria-hidden="true">⌕</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={copy.search} aria-label={copy.search} type="search" />
            </label>
            <GoogleTranslate />
          </div>
          <nav className="category-strip no-scrollbar" aria-label={copy.menu}>
            {NAV.filter((id) => id === "all" || id === "popular" || products.some((product) => product.available && product.category === id)).map((id) => (
              <button key={id} type="button" aria-pressed={cat === id} onClick={() => setCat(id)}>{t(categoryNames[id], locale)}</button>
            ))}
          </nav>
          <section className="menu-grid-wrap" aria-label={copy.menu}>
            {visible.length === 0 ? <p className="menu-empty">{copy.empty}</p> : (
              <div className="dish-grid">{visible.map((product) => <VideoCard key={product.id} product={product} locale={locale} onOpen={setReel} />)}</div>
            )}
          </section>
        </main>
      )}
      {reel && <ReelViewer products={visible.length ? visible : products.filter((product) => product.available)} startId={reel} locale={locale} onClose={() => setReel(null)} />}
    </div>
  );
}
