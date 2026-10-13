"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Locale, Product } from "@/lib/types";
import { categoryNames, money, t, ui } from "@/lib/i18n";
import { assetPath } from "@/lib/assets";

export function ReelViewer({ products, startId, locale, onClose }: {
  products: Product[]; startId: string; locale: Locale; onClose: () => void;
}) {
  const [index, setIndex] = useState(Math.max(0, products.findIndex((p) => p.id === startId)));
  const [paused, setPaused] = useState(false);
  const [failedId, setFailedId] = useState<string | null>(null);
  const [variant, setVariant] = useState(0);
  const dialog = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const product = products[index];

  const go = useCallback((direction: number) => {
    setIndex((i) => (i + direction + products.length) % products.length);
    setVariant(0);
    setFailedId(null);
    setPaused(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, [products.length]);

  useEffect(() => {
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) setPaused(true);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowUp" || event.key === "ArrowLeft") { event.preventDefault(); go(-1); }
      if (event.key === "ArrowDown" || event.key === "ArrowRight") { event.preventDefault(); go(1); }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [go, onClose]);

  useEffect(() => {
    if (!video.current) return;
    if (paused) video.current.pause();
    else video.current.play().catch(() => setPaused(true));
  }, [paused, index]);

  if (!product) return null;
  const hasVideo = !!product.video && failedId !== product.id;
  const price = product.variants?.[variant]?.price ?? product.price;
  const weight = product.variants?.[variant]?.label ?? product.weight;
  const previous = locale === "pl" ? "Poprzednie danie" : locale === "en" ? "Previous dish" : "Попередня страва";
  const next = locale === "pl" ? "Następne danie" : locale === "en" ? "Next dish" : "Наступна страва";

  return <div className="story-overlay" role="presentation" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
    <div ref={dialog} className="story-viewer" role="dialog" aria-modal="true" aria-labelledby="dish-title"
      onWheel={(e) => { if (Math.abs(e.deltaY) > 35) go(e.deltaY > 0 ? 1 : -1); }}
      onTouchStart={(e) => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }}
      onTouchEnd={(e) => {
        if (!touch.current) return;
        const dy = e.changedTouches[0].clientY - touch.current.y;
        const dx = e.changedTouches[0].clientX - touch.current.x;
        if (Math.abs(dy) > 45 && Math.abs(dy) > Math.abs(dx)) go(dy < 0 ? 1 : -1);
        else if (Math.abs(dx) > 70) go(dx < 0 ? 1 : -1);
        touch.current = null;
      }}>
      <div className="story-media">
        {hasVideo
          ? <video ref={video} key={product.id} src={assetPath(product.video!)} poster={assetPath(product.poster)} muted loop playsInline autoPlay preload="metadata" onError={() => setFailedId(product.id)} />
          : /* eslint-disable-next-line @next/next/no-img-element */
            <img src={assetPath(product.poster)} alt={t(product.name, locale)} />}
      </div>
      <div className="story-shade" />
      <div className="story-progress" aria-hidden="true">{products.map((p, i) => <span key={p.id} className={i === index ? "active" : i < index ? "seen" : ""} />)}</div>
      <div className="story-top"><span className="story-wordmark">the cork <i>·</i> R32</span><button ref={closeButton} type="button" onClick={onClose} aria-label={ui[locale].close}>×</button></div>
      <div className="story-controls">
        <button type="button" onClick={() => setPaused((p) => !p)} aria-label={paused ? ui[locale].play : ui[locale].pause}>{paused ? "▶" : "Ⅱ"}</button>
        <span>{String(index + 1).padStart(2, "0")} / {String(products.length).padStart(2, "0")}</span>
      </div>
      <div className="story-copy" aria-live="polite">
        <p className="story-category">{t(categoryNames[product.category], locale)}</p>
        <h2 id="dish-title">{t(product.name, locale)}</h2>
        <p className="story-description">{t(product.description, locale)}</p>
        <p className="story-price">{money(price, product.currency)}{weight && <small> · {weight}</small>}</p>
        {product.variants && <div className="story-variants" role="group" aria-label={locale === "pl" ? "Porcja" : locale === "en" ? "Portion" : "Порція"}>{product.variants.map((v, i) => <button key={v.label} type="button" aria-pressed={variant === i} onClick={() => setVariant(i)}>{v.label} · {money(v.price)}</button>)}</div>}
        <details><summary>{ui[locale].ingredients}</summary><p>{t(product.ingredients, locale)}</p></details>
        <details><summary>{ui[locale].allergens}</summary><p>{t(product.allergens, locale)}</p></details>
        <nav className="story-nav" aria-label={ui[locale].menu}><button type="button" aria-label={previous} onClick={() => go(-1)}>↑</button><button type="button" aria-label={next} onClick={() => go(1)}>↓</button></nav>
      </div>
    </div>
  </div>;
}
