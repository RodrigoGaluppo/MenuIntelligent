"use client";
/* eslint-disable @next/next/no-img-element */

import type { Locale, Product } from "@/lib/types";
import { t } from "@/lib/i18n";
import { assetPath } from "@/lib/assets";

export function VideoCard({ product, locale, onOpen }: { product: Product; locale: Locale; onOpen: () => void }) {
  return <button type="button" className="dish-card" onClick={onOpen} aria-label={t(product.name, locale)}>
    <span className="dish-media">
      <img src={assetPath(product.poster)} alt="" loading="lazy" decoding="async" />
    </span>
    <span className="dish-content">
      <span className="dish-title">{t(product.name, locale)}</span>
    </span>
  </button>;
}
