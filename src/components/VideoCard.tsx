"use client";
import type { Locale, Product } from "@/lib/types";
import { categoryNames, money, t } from "@/lib/i18n";
import { assetPath } from "@/lib/assets";

export function VideoCard({product, locale, onOpen}: {product: Product; locale: Locale; onOpen: (id: string) => void}) {
  return <button type="button" className="dish-card" onClick={() => onOpen(product.id)} aria-label={t(product.name,locale)}>
    <div className="dish-image">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={assetPath(product.poster)} alt={t(product.name,locale)} loading="lazy" decoding="async" />
      {product.featured && <span className="dish-badge">{locale === "pl" ? "Warto spróbować" : locale === "en" ? "A Cork favourite" : "Варто спробувати"}</span>}
      <span className="dish-open" aria-hidden="true">{product.video ? "▶" : "↗"}</span>
    </div>
    <div className="dish-content">
      <p className="dish-category">{t(categoryNames[product.category],locale)}</p>
      <h3 className="dish-title">{t(product.name,locale)}</h3>
      <p className="dish-description">{t(product.description,locale)}</p>
      <div className="dish-bottom"><span className="dish-price">{product.variants?.length ? (locale === "pl" ? "od " : locale === "en" ? "from " : "від ") : ""}{money(product.price,product.currency)}</span><span className="dish-weight">{product.weight}</span></div>
    </div>
  </button>;
}
