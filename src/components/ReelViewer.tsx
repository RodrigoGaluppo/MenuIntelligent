"use client";
/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useRef, useState } from "react";
import type { Locale, Product } from "@/lib/types";
import { money, t, ui } from "@/lib/i18n";
import { assetPath } from "@/lib/assets";
import { Icon } from "./Icons";

function copyCanScroll(target: EventTarget | null, direction: number) {
  const copy = target instanceof Element ? target.closest<HTMLElement>(".story-copy") : null;
  if (!copy || copy.scrollHeight <= copy.clientHeight + 2) return false;
  return direction > 0
    ? copy.scrollTop + copy.clientHeight < copy.scrollHeight - 2
    : copy.scrollTop > 2;
}

export function ReelViewer({ products, startId, locale, onClose }: {
  products: Product[]; startId: string; locale: Locale; onClose: () => void;
}) {
  const initialIndex = Math.max(0, products.findIndex((p) => p.id === startId));
  const [index, setIndex] = useState(initialIndex);
  const indexRef = useRef(initialIndex);
  const [paused, setPaused] = useState(false);
  const [failedId, setFailedId] = useState<string | null>(null);
  const [variant, setVariant] = useState(0);
  const dialog = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const touch = useRef<{ x: number; y: number; copy: { top: number; height: number; total: number } | null } | null>(null);
  const wheel = useRef({ total: 0, last: 0, lockedUntil: 0 });
  const product = products[index];

  const go = useCallback((direction: number) => {
    if (products.length < 2) return;
    const next = Math.max(0, Math.min(products.length - 1, indexRef.current + direction));
    if (next === indexRef.current) return;
    indexRef.current = next;
    setIndex(next);
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
      if (event.key === "ArrowUp" || event.key === "PageUp") { event.preventDefault(); go(-1); }
      if (event.key === "ArrowDown" || event.key === "PageDown") { event.preventDefault(); go(1); }
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
  return <div className="story-overlay" role="presentation" onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <div ref={dialog} className="story-viewer" role="dialog" aria-modal="true" aria-labelledby="dish-title"
      onWheel={(event) => {
        const direction = Math.sign(event.deltaY);
        if (!direction || copyCanScroll(event.target, direction)) return;
        const now = performance.now();
        if (now < wheel.current.lockedUntil) return;
        wheel.current.total = now - wheel.current.last > 180 ? event.deltaY : wheel.current.total + event.deltaY;
        wheel.current.last = now;
        if (Math.abs(wheel.current.total) < 70) return;
        go(Math.sign(wheel.current.total));
        wheel.current.total = 0;
        wheel.current.lockedUntil = now + 650;
      }}
      onTouchStart={(event) => {
        const copy = event.target instanceof Element ? event.target.closest<HTMLElement>(".story-copy") : null;
        touch.current = {
          x: event.touches[0].clientX,
          y: event.touches[0].clientY,
          copy: copy ? { top: copy.scrollTop, height: copy.clientHeight, total: copy.scrollHeight } : null,
        };
      }}
      onTouchEnd={(event) => {
        if (!touch.current) return;
        const dy = event.changedTouches[0].clientY - touch.current.y;
        const dx = event.changedTouches[0].clientX - touch.current.x;
        if (Math.abs(dy) > 60 && Math.abs(dy) > Math.abs(dx)) {
          const direction = dy < 0 ? 1 : -1;
          const copy = touch.current.copy;
          const canScroll = copy && copy.total > copy.height + 2 && (direction > 0
            ? copy.top + copy.height < copy.total - 2
            : copy.top > 2);
          if (!canScroll) go(direction);
        }
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
        {products.length > 1 && <span className="story-count">{String(index + 1).padStart(2, "0")} / {String(products.length).padStart(2, "0")}</span>}
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
