"use client";
/* eslint-disable @next/next/no-img-element */

import type { Locale, Product } from "@/lib/types";
import { money, t } from "@/lib/i18n";
import { assetPath } from "@/lib/assets";
import { Icon } from "./Icons";

const more = { pl: "Zobacz więcej", en: "View more", uk: "Дізнатися більше" };

export function VideoCard({ product, locale, open, onToggle, onOpen }: {
  product: Product; locale: Locale; open: boolean; onToggle: () => void; onOpen: () => void;
}) {
  const id = `dish-details-${product.id}`;
  return <article className={"dish-card " + (open ? "is-open" : "")}>
    <button type="button" className="dish-trigger" aria-expanded={open} aria-controls={id} onClick={onToggle}>
      <span className="dish-media"><img src={assetPath(product.poster)} alt="" loading="lazy" decoding="async" /></span>
      <span className="dish-heading"><span className="dish-title">{t(product.name, locale)}</span><span className="dish-price">{money(product.price, product.currency)}</span></span>
      <Icon name="chevron" className="dish-chevron" />
    </button>
    <div id={id} className="dish-reveal" aria-hidden={!open} inert={!open}>
      <div className="dish-reveal-inner"><div className="dish-reveal-content">
        <p className="dish-ingredients">{t(product.ingredients, locale)}</p>
        <button type="button" className="dish-more" onClick={onOpen}>{more[locale]}<Icon name="external" /></button>
      </div></div>
    </div>
  </article>;
}
