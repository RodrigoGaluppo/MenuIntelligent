"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
import type { Locale, Product } from "@/lib/types";
import { money, t } from "@/lib/i18n";
import { assetPath } from "@/lib/assets";

export function VideoCard({ product, locale, onOpen }: { product: Product; locale: Locale; onOpen: () => void }) {
  const video = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const element = video.current;
    if (!element) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !motion.matches) element.play().catch(() => element.pause());
      else element.pause();
    }, { threshold: 0.55 });
    observer.observe(element);
    return () => { observer.disconnect(); element.pause(); };
  }, [failed, product.video]);

  return <button type="button" className="dish-card" onClick={onOpen} aria-label={t(product.name, locale) + " · " + t(product.ingredients, locale)}>
    <span className="dish-media">
      {product.video && !failed
        ? <video ref={video} src={assetPath(product.video)} poster={assetPath(product.poster)} muted loop playsInline preload="none" onError={() => setFailed(true)} />
        : <img src={assetPath(product.poster)} alt="" loading="lazy" decoding="async" />}
    </span>
    <span className="dish-content">
      <span className="dish-title">{t(product.name, locale)}</span>
      <span className="dish-ingredients">{t(product.ingredients, locale)}</span>
      <span className="dish-meta"><span>{product.variants?.length ? (locale === "pl" ? "od " : locale === "en" ? "from " : "від ") : ""}{money(product.price, product.currency)}</span>{product.weight && <span>{product.weight}</span>}</span>
    </span>
  </button>;
}
