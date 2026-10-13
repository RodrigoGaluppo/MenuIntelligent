"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Locale, Product } from "@/lib/types";
import { categoryNames, money, t, ui } from "@/lib/i18n";
import { assetPath } from "@/lib/assets";

export function ReelViewer({products, startId, locale, onClose}: {
  products: Product[]; startId: string; locale: Locale; onClose: () => void;
}) {
  const [index,setIndex] = useState(Math.max(0,products.findIndex(p => p.id === startId)));
  const [paused,setPaused] = useState(true);
  const [failedId,setFailedId] = useState<string | null>(null);
  const [variant,setVariant] = useState(0);
  const dialog = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const touch = useRef<{x: number; y: number} | null>(null);
  const product = products[index];
  const go = useCallback((direction: number) => {
    setIndex(i => (i + direction + products.length) % products.length);
    setVariant(0);
    setFailedId(null);
    setPaused(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    dialog.current?.scrollTo({top:0});
  },[products.length]);

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPaused(media.matches);
    const onPreference = () => setPaused(media.matches);
    media.addEventListener("change",onPreference);
    return () => {
      document.body.style.overflow = overflow;
      previousFocus?.focus();
      media.removeEventListener("change",onPreference);
    };
  },[]);

  useEffect(() => {
    if (!video.current) return;
    if (paused) video.current.pause();
    else video.current.play().catch(() => setPaused(true));
  },[paused,index]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") { event.preventDefault(); go(-1); }
      if (event.key === "ArrowRight") { event.preventDefault(); go(1); }
      if (event.key !== "Tab") return;
      const nodes = dialog.current?.querySelectorAll<HTMLElement>("button, a[href], summary, input, [tabindex='0']");
      if (!nodes?.length) return;
      const first = nodes[0], last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown",onKey);
    return () => window.removeEventListener("keydown",onKey);
  },[go,onClose]);

  if (!product) return null;
  const hasVideo = !!product.video && failedId !== product.id;
  const price = product.variants?.[variant]?.price ?? product.price;
  const weight = product.variants?.[variant]?.label ?? product.weight;
  const note = locale === "pl" ? "Wizualizacja dania ma charakter ilustracyjny." : locale === "en" ? "This dish visualisation is illustrative." : "Зображення страви є ілюстративним.";
  const previous = locale === "pl" ? "Poprzednie danie" : locale === "en" ? "Previous dish" : "Попередня страва";
  const next = locale === "pl" ? "Następne danie" : locale === "en" ? "Next dish" : "Наступна страва";

  return <div className="reel-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    <div ref={dialog} className="reel-dialog" role="dialog" aria-modal="true" aria-labelledby="dish-title">
      <button ref={closeButton} type="button" className="reel-close" onClick={onClose} aria-label={ui[locale].close}>×</button>
      <div className="reel-media"
        onTouchStart={e => { touch.current={x:e.touches[0].clientX,y:e.touches[0].clientY}; }}
        onTouchEnd={e => {
          if (!touch.current) return;
          const dx=e.changedTouches[0].clientX-touch.current.x;
          const dy=e.changedTouches[0].clientY-touch.current.y;
          if (Math.abs(dx)>60 && Math.abs(dx)>Math.abs(dy)) go(dx<0?1:-1);
          touch.current=null;
        }}>
        {hasVideo ? <video ref={video} key={product.id} src={assetPath(product.video!)} poster={assetPath(product.poster)} muted loop playsInline preload="metadata" onError={() => setFailedId(product.id)} /> :
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={assetPath(product.poster)} alt={t(product.name,locale)} />}
        <span>THE CORK · R32</span>
        {hasVideo && <button type="button" className="reel-play" onClick={() => setPaused(p=>!p)}>{paused ? "▶ " + ui[locale].play : "Ⅱ " + ui[locale].pause}</button>}
      </div>
      <div className="reel-copy" aria-live="polite">
        <p className="eyebrow">{t(categoryNames[product.category],locale)}</p>
        <h2 id="dish-title">{t(product.name,locale)}</h2>
        <p className="reel-description">{t(product.description,locale)}</p>
        {product.variants && <div className="variant-list" role="group" aria-label={locale === "pl" ? "Porcja" : locale === "en" ? "Portion" : "Порція"}>{product.variants.map((v,i) => <button key={v.label} aria-pressed={variant===i} onClick={()=>setVariant(i)}>{v.label} · {money(v.price)}</button>)}</div>}
        <p className="reel-price">{money(price,product.currency)} <small className="dish-weight">/ {weight}</small></p>
        {product.addOns && <details><summary>{locale === "pl" ? "Dodatki" : locale === "en" ? "Optional additions" : "Додатки"}</summary>{product.addOns.map(add => <p key={add.label.en}>{t(add.label,locale)} · {add.weight} · +{money(add.price)}</p>)}</details>}
        <details><summary>{ui[locale].ingredients}</summary><p>{t(product.ingredients,locale)}</p></details>
        <details><summary>{ui[locale].allergens}</summary><p>{t(product.allergens,locale)}</p></details>
        <p className="image-note">{note}</p>
        <nav className="reel-navigation" aria-label={ui[locale].menu}><span>{String(index+1).padStart(2,"0")} / {String(products.length).padStart(2,"0")}</span><button aria-label={previous} onClick={()=>go(-1)}>←</button><button aria-label={next} onClick={()=>go(1)}>→</button></nav>
      </div>
    </div>
  </div>;
}
