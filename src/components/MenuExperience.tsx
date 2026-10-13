"use client";

import { useMemo, useState } from "react";
import type { Locale, Product, Restaurant } from "@/lib/types";
import { LOCALES, categoryNames, money, t, ui } from "@/lib/i18n";
import { VideoCard } from "./VideoCard";
import { ReelViewer } from "./ReelViewer";
import { GoogleTranslate } from "./GoogleTranslate";
import { assetPath } from "@/lib/assets";

const NAV = ["all", "popular", "ritual", "starters", "snacks", "mains", "meat", "seafood", "desserts"];

export function MenuExperience({ restaurant, products }: { restaurant: Restaurant; products: Product[] }) {
  const [locale, setLocale] = useState<Locale>("pl");
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("all");
  const [reel, setReel] = useState<string | null>(null);

  const available = useMemo(() => products.filter((product) => product.available), [products]);
  const visible = useMemo(() => {
    const q = query.trim().toLocaleLowerCase();
    return available.filter((product) => {
      const text = (t(product.name, locale) + " " + t(product.description, locale)).toLocaleLowerCase();
      return (!q || text.includes(q)) &&
        (cat === "all" || (cat === "popular" ? product.featured : product.category === cat));
    });
  }, [available, cat, locale, query]);

  const hero = available.find((product) => product.id === "olive-ritual") ?? available.find((product) => product.video) ?? available[0];
  const copy = ui[locale];

  return (
    <div className="menu-app">
      <a className="skip-link" href="#menu">{copy.menu}</a>
      <header className="menu-header">
        <a className="brand-lockup" href="#" aria-label="The Cork">
          <span className="brand-seal" aria-hidden="true">c</span>
          <span className="wordmark">the cork<span>{t(restaurant.tagline, locale)}</span></span>
        </a>
        <div className="header-tools">
          <span className="header-location">{t(restaurant.city, locale)}</span>
          <div className="language-switch" role="group" aria-label={copy.language}>
            {LOCALES.map((language) => (
              <button key={language.id} type="button" aria-pressed={locale === language.id} onClick={() => setLocale(language.id)}>
                {language.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="search-strip">
        <label className="search-box">
          <span aria-hidden="true">⌕</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={copy.search} aria-label={copy.search} type="search" />
        </label>
        <GoogleTranslate />
      </div>

      {hero && (
        <section className="feature-hero" aria-label={t(hero.name, locale)}>
          <div className="feature-media">
            {hero.video ? (
              <video key={hero.id} poster={assetPath(hero.poster)} autoPlay muted loop playsInline preload="metadata">
                <source src={assetPath(hero.video)} type="video/mp4" />
              </video>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={assetPath(hero.poster)} alt={t(hero.name, locale)} />
            )}
            <span className="feature-kicker">THE CORK <i>·</i> R32 WROCŁAW</span>
          </div>
          <div className="feature-copy">
            <p className="feature-eyebrow">{t(restaurant.city, locale)} <span>·</span> {t(categoryNames[hero.category], locale)}</p>
            <h1>{t(hero.name, locale)}</h1>
            <p className="feature-description">{t(hero.description, locale)}</p>
            <div className="feature-actions">
              <span className="feature-price">{money(hero.price, hero.currency)}<small>{hero.weight}</small></span>
              <button type="button" className="watch-button" onClick={() => setReel(hero.id)}>{copy.watchDish}<span aria-hidden="true">↗</span></button>
            </div>
            <p className="feature-brand">great people. <em>real food.</em></p>
          </div>
        </section>
      )}

      <nav className="category-strip no-scrollbar" aria-label={copy.menu}>
        {NAV.filter((id) => id === "all" || id === "popular" || available.some((product) => product.category === id)).map((id) => (
          <button key={id} type="button" aria-pressed={cat === id} onClick={() => setCat(id)}>
            {t(categoryNames[id], locale)}
            {id === "all" && <sup>{available.length}</sup>}
          </button>
        ))}
      </nav>

      <main id="menu" className="menu-content">
        <div className="menu-intro">
          <div><p className="menu-overline">{t(restaurant.tagline, locale)}</p><h2>{copy.menu}</h2></div>
          <a className="pdf-link" href={assetPath("/menu-september-2026.pdf")} target="_blank" rel="noreferrer">PDF ↗</a>
        </div>
        {visible.length ? (
          <div className="dish-grid">{visible.map((product) => <VideoCard key={product.id} product={product} locale={locale} onOpen={setReel} />)}</div>
        ) : (
          <div className="empty-state"><p>{copy.empty}</p></div>
        )}
      </main>

      <footer className="menu-footer">
        <a className="brand-lockup footer-brand" href="#" aria-label="The Cork">
          <span className="brand-seal" aria-hidden="true">c</span>
          <span className="wordmark">the cork<span>great people. real food.</span></span>
        </a>
        <span>{t(restaurant.address, locale)} · {restaurant.phone}</span>
        <a href="https://thecork.pl" target="_blank" rel="noreferrer">THECORK.PL ↗</a>
      </footer>

      {reel && <ReelViewer products={visible.length ? visible : available} startId={reel} locale={locale} onClose={() => setReel(null)} />}
    </div>
  );
}
