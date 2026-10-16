"use client";
/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { Locale, Product } from "@/lib/types";
import { money, t, ui } from "@/lib/i18n";
import { assetPath } from "@/lib/assets";
import { Icon } from "./Icons";
import { CorkMark } from "./Brand";

function StorySlide({ product, locale, active, number, total, reducedMotion }: {
  product: Product; locale: Locale; active: boolean; number: number; total: number; reducedMotion: boolean;
}) {
  const [paused, setPaused] = useState(false);
  const [manualPlay, setManualPlay] = useState(false);
  const [failed, setFailed] = useState(false);
  const [variant, setVariant] = useState(0);
  const [pageVisible, setPageVisible] = useState(true);
  const video = useRef<HTMLVideoElement>(null);
  const hasVideo = Boolean(product.video) && !failed;
  const playing = active && pageVisible && hasVideo && (manualPlay || (!paused && !reducedMotion));
  const price = product.variants?.[variant]?.price ?? product.price;
  const weight = product.variants?.[variant]?.label ?? product.weight;

  useEffect(() => {
    if (!active) return;
    const updateVisibility = () => setPageVisible(!document.hidden);
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, [active]);

  useEffect(() => {
    let cancelled = false;
    if (!active) {
      video.current?.pause();
      setPaused(false);
      setManualPlay(false);
      setVariant(0);
      return;
    }
    if (!video.current) return;
    if (!playing) video.current.pause();
    else video.current.play().catch(() => {
      if (!cancelled) {
        setPaused(true);
        setManualPlay(false);
      }
    });
    return () => { cancelled = true; };
  }, [active, playing]);

  return <section className="story-slide" aria-hidden={!active} inert={!active}>
    <div className="story-media">
      <img src={assetPath(product.poster)} alt="" loading={active ? "eager" : "lazy"} decoding="async" />
      {active && hasVideo && <video ref={video} src={assetPath(product.video!)} poster={assetPath(product.poster)} muted loop playsInline preload="metadata" onError={() => setFailed(true)} />}
    </div>
    <div className="story-shade" />
    <div className="story-slide-top"><span>{String(number).padStart(2, "0")} <span className="story-count-divider">/</span> {String(total).padStart(2, "0")}</span>
      {hasVideo && <button className="story-icon" type="button" onClick={() => {
        if (reducedMotion) setManualPlay((current) => !current);
        else setPaused((current) => !current);
      }} aria-label={playing ? ui[locale].pause : ui[locale].play}><Icon name={playing ? "pause" : "play"} /></button>}
    </div>
    <div className="story-copy">
      <span className="story-kicker">THE CORK · R32</span>
      <h2>{t(product.name, locale)}</h2>
      <p className="story-ingredients">{t(product.ingredients, locale)}</p>
      <div className="story-price"><strong>{money(price, product.currency)}</strong>{weight && <span>· {weight}</span>}</div>
      {product.variants && <div className="story-variants" role="group" aria-label={locale === "pl" ? "Porcja" : locale === "en" ? "Portion" : "Порція"}>{product.variants.map((item, i) => <button key={item.label} type="button" aria-pressed={variant === i} onClick={() => setVariant(i)}>{item.label}</button>)}</div>}
      <details className="story-allergens"><summary><Icon name="info" />{ui[locale].allergens}<Icon name="chevron" /></summary><p>{t(product.allergens, locale)}</p></details>
    </div>
  </section>;
}

export function ReelViewer({ products, startId, locale, onClose }: {
  products: Product[]; startId: string; locale: Locale; onClose: () => void;
}) {
  const initialIndex = Math.max(0, products.findIndex((p) => p.id === startId));
  const loop = products.length > 1;
  const initialSlot = initialIndex + (loop ? 1 : 0);
  const [slot, setSlot] = useState(initialSlot);
  const [reducedMotion, setReducedMotion] = useState(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const slotRef = useRef(initialSlot);
  const scroller = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const settleTimer = useRef<number | undefined>(undefined);
  const frame = useRef<number | undefined>(undefined);
  const resetFrame = useRef<number | undefined>(undefined);
  const navigationTarget = useRef<number | null>(null);
  const previousHeight = useRef(0);
  const slides = useMemo(() => loop ? [products[products.length - 1], ...products, products[0]] : products, [products, loop]);
  const logicalIndex = loop ? (slot - 1 + products.length) % products.length : 0;

  const jumpTo = useCallback((target: number) => {
    const node = scroller.current;
    if (!node) return;
    if (resetFrame.current !== undefined) cancelAnimationFrame(resetFrame.current);
    node.style.scrollSnapType = "none";
    node.style.scrollBehavior = "auto";
    node.scrollTop = target * node.clientHeight;
    slotRef.current = target;
    setSlot(target);
    resetFrame.current = requestAnimationFrame(() => {
      node.style.scrollSnapType = "";
      node.style.scrollBehavior = "";
      resetFrame.current = undefined;
    });
  }, []);

  const settle = useCallback(() => {
    const node = scroller.current;
    if (!node || !node.clientHeight) return;
    navigationTarget.current = null;
    if (!loop) return;
    const nearest = Math.round(node.scrollTop / node.clientHeight);
    const target = nearest === 0 ? products.length : nearest === products.length + 1 ? 1 : nearest;
    // Recenter only after a clone has snapped fully into view. A gesture still in
    // progress must keep its native momentum and its current visual position.
    if (target !== nearest && Math.abs(node.scrollTop - nearest * node.clientHeight) < 2) jumpTo(target);
  }, [jumpTo, loop, products.length]);

  const updateFromScroll = useCallback(() => {
    const node = scroller.current;
    if (!node || !node.clientHeight) return;
    const next = Math.max(0, Math.min(slides.length - 1, Math.round(node.scrollTop / node.clientHeight)));
    if (next !== slotRef.current) {
      slotRef.current = next;
      setSlot(next);
    }
  }, [slides.length]);

  useLayoutEffect(() => {
    const node = scroller.current;
    if (!node) return;
    node.scrollTop = initialSlot * node.clientHeight;
    previousHeight.current = node.clientHeight;
    const observer = new ResizeObserver(() => {
      const height = node.clientHeight;
      if (!height || height === previousHeight.current) return;
      const progress = previousHeight.current ? node.scrollTop / previousHeight.current : slotRef.current;
      previousHeight.current = height;
      if (resetFrame.current !== undefined) cancelAnimationFrame(resetFrame.current);
      node.style.scrollSnapType = "none";
      node.style.scrollBehavior = "auto";
      node.scrollTop = progress * height;
      resetFrame.current = requestAnimationFrame(() => {
        node.style.scrollSnapType = "";
        node.style.scrollBehavior = "";
        resetFrame.current = undefined;
      });
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [initialSlot]);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotion = () => setReducedMotion(motion.matches);
    onMotion();
    motion.addEventListener("change", onMotion);
    const previousFocus = document.activeElement as HTMLElement | null;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();
    return () => {
      motion.removeEventListener("change", onMotion);
      document.body.style.overflow = oldOverflow;
      window.clearTimeout(settleTimer.current);
      if (frame.current) cancelAnimationFrame(frame.current);
      if (resetFrame.current !== undefined) cancelAnimationFrame(resetFrame.current);
      previousFocus?.focus();
    };
  }, []);

  useEffect(() => {
    const node = scroller.current;
    if (!node) return;
    const onScrollEnd = () => { window.clearTimeout(settleTimer.current); settle(); };
    node.addEventListener("scrollend", onScrollEnd);
    return () => node.removeEventListener("scrollend", onScrollEnd);
  }, [settle]);

  const move = useCallback((direction: number) => {
    const node = scroller.current;
    if (!node || !loop || navigationTarget.current !== null) return;
    // Continue an outward gesture from the matching real slide after the clone
    // has fully settled. Inward gestures can use the native adjacent slide.
    if (slotRef.current === 0 && direction < 0) {
      if (node.scrollTop > 1) return;
      jumpTo(products.length);
    } else if (slotRef.current === slides.length - 1 && direction > 0) {
      if (node.scrollTop < node.scrollHeight - node.clientHeight - 1) return;
      jumpTo(1);
    }
    const next = Math.max(0, Math.min(slides.length - 1, slotRef.current + direction));
    navigationTarget.current = next;
    node.scrollTo({ top: next * node.clientHeight, behavior: reducedMotion ? "instant" : "smooth" });
  }, [jumpTo, loop, products.length, slides.length, reducedMotion]);

  if (!products.length) return null;
  return <div className="story-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <div ref={dialog} className="story-viewer" role="dialog" aria-modal="true" aria-label={`${t(products[logicalIndex].name, locale)} · ${logicalIndex + 1} / ${products.length}`}
      onKeyDown={(event) => {
        if (event.key === "Escape") { event.preventDefault(); onClose(); }
        if (event.key === "ArrowUp" || event.key === "PageUp") { event.preventDefault(); move(-1); }
        if (event.key === "ArrowDown" || event.key === "PageDown") { event.preventDefault(); move(1); }
        if (event.key === "Tab") {
          const focusables = Array.from(dialog.current?.querySelectorAll<HTMLElement>("button, summary") ?? []).filter((element) => !element.closest("[inert]"));
          if (!focusables.length) return;
          const first = focusables[0], last = focusables[focusables.length - 1];
          if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
          else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        }
      }}>
      <div className="story-chrome"><div className="story-wordmark"><CorkMark /> THE CORK</div><button ref={closeButton} className="story-icon" type="button" onClick={onClose} aria-label={ui[locale].close}><Icon name="close" /></button></div>
      <div ref={scroller} className="story-scroller" onWheel={(event) => {
        if (!loop || !event.deltaY || !scroller.current) return;
        const node = scroller.current;
        const copy = event.target instanceof Element ? event.target.closest<HTMLElement>(".story-copy") : null;
        if (copy && copy.scrollHeight > copy.clientHeight + 2) {
          const canScroll = event.deltaY > 0
            ? copy.scrollTop + copy.clientHeight < copy.scrollHeight - 2
            : copy.scrollTop > 2;
          if (canScroll) return;
        }
        // Give the next wheel gesture room to travel past either cloned edge.
        if (event.deltaY < 0 && node.scrollTop <= 1) jumpTo(products.length);
        else if (event.deltaY > 0 && node.scrollTop >= node.scrollHeight - node.clientHeight - 1) jumpTo(1);
      }} onTouchStart={() => {
        if (!loop || !scroller.current) return;
        const node = scroller.current;
        if (node.scrollTop <= 1) jumpTo(products.length);
        else if (node.scrollTop >= node.scrollHeight - node.clientHeight - 1) jumpTo(1);
      }} onScroll={() => {
        if (frame.current) cancelAnimationFrame(frame.current);
        frame.current = requestAnimationFrame(updateFromScroll);
        window.clearTimeout(settleTimer.current);
        settleTimer.current = window.setTimeout(settle, 240);
      }}>
        {slides.map((product, i) => <StorySlide key={`${i}-${product.id}`} product={product} locale={locale} active={slot === i} number={loop ? ((i - 1 + products.length) % products.length) + 1 : 1} total={products.length} reducedMotion={reducedMotion} />)}
      </div>
      {loop && <div className="story-rail" aria-hidden="true">{products.map((product, i) => <span key={product.id} className={i === logicalIndex ? "is-active" : ""} />)}</div>}
      {loop && <div className="story-hint" aria-hidden="true">{locale === "pl" ? "Przewiń, aby odkrywać" : locale === "en" ? "Scroll to explore" : "Гортайте, щоб відкрити"}<Icon name="chevron" /></div>}
    </div>
  </div>;
}
