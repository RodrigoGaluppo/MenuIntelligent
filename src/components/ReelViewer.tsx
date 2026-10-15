"use client";
/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useRef, useState } from "react";
import type { Locale, Product } from "@/lib/types";
import { money, t, ui } from "@/lib/i18n";
import { assetPath } from "@/lib/assets";
import { Icon } from "./Icons";

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
    if (products.length < 2) return;
    setIndex((i) => (i + direction + products.length) % products.length);
    setVariant(0);
    setFailedId(null);
    setPaused(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, [products.length]);

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPaused(true);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") { event.preventDefault(); go(-1); }
      if (event.key === "ArrowRight" || event.key === "ArrowDown") { event.preventDefault(); go(1); }
      if (event.key === "Tab") {
        const focusables = dialog.current?.querySelectorAll<HTMLElement>("button, summary");
        if (!focusables?.length) return;
        const first = focusables[0], last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener("keydown", onKey);
      previousFocus?.focus();
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

  return <div className="story-overlay" role="presentation" onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <div ref={dialog} className="story-viewer" role="dialog" aria-modal="true" aria-labelledby="dish-title"
      onTouchStart={(event) => { touch.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }}
      onTouchEnd={(event) => {
        if (!touch.current) return;
        const dy = event.changedTouches[0].clientY - touch.current.y;
        const dx = event.changedTouches[0].clientX - touch.current.x;
        if (Math.abs(dy) > 60 && Math.abs(dy) > Math.abs(dx)) go(dy < 0 ? 1 : -1);
        else if (Math.abs(dx) > 90) go(dx < 0 ? 1 : -1);
        touch.current = null;
      }}>
      <div className="story-media" key={product.id}>
        {hasVideo
          ? <video ref={video} src={assetPath(product.video!)} poster={assetPath(product.poster)} muted loop playsInline autoPlay preload="metadata" onError={() => setFailedId(product.id)} />
          : <img src={assetPath(product.poster)} alt={t(product.name, locale)} />}
      </div>
      <div className="story-shade" />
      <div className="story-top"><span className="story-wordmark">THE CORK</span><button ref={closeButton} className="story-icon" type="button" onClick={onClose} aria-label={ui[locale].close}><Icon name="close" /></button></div>
      <div className="story-side">
        {hasVideo && <button className="story-icon" type="button" onClick={() => setPaused((current) => !current)} aria-label={paused ? ui[locale].play : ui[locale].pause}><Icon name={paused ? "play" : "pause"} /></button>}
        {products.length > 1 && <><span className="story-count">{String(index + 1).padStart(2, "0")} / {String(products.length).padStart(2, "0")}</span><button className="story-icon" type="button" aria-label={previous} onClick={() => go(-1)}><Icon name="up" /></button><button className="story-icon" type="button" aria-label={next} onClick={() => go(1)}><Icon name="down" /></button></>}
      </div>
      <div className="story-copy" key={product.id + "-copy"} aria-live="polite">
        <h2 id="dish-title">{t(product.name, locale)}</h2>
        <p className="story-ingredients">{t(product.ingredients, locale)}</p>
        <p className="story-price">{money(price, product.currency)}{weight && <span>· {weight}</span>}</p>
        {product.variants && <div className="story-variants" role="group" aria-label={locale === "pl" ? "Porcja" : locale === "en" ? "Portion" : "Порція"}>{product.variants.map((item, i) => <button key={item.label} type="button" aria-pressed={variant === i} onClick={() => setVariant(i)}>{item.label}</button>)}</div>}
        <details className="story-allergens"><summary><Icon name="info" />{ui[locale].allergens}</summary><p>{t(product.allergens, locale)}</p></details>
      </div>
    </div>
  </div>;
}
