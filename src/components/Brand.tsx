import { useId, type CSSProperties } from "react";
import { assetPath } from "@/lib/assets";
import "./BrandMotion.css";

// Each crop follows one part of the restaurant's original artwork, including
// the fork and knife. The complete original image takes over at rest.
const logoPieces = [
  [0, 0, 92, 228, -24, -8, -5],
  [92, 0, 74, 228, -14, -30, -8],
  [166, 0, 56, 228, 9, -24, 7],
  [222, 0, 112, 228, 15, 18, 4],
  [334, 0, 185, 228, -9, -20, -4],
  [519, 153, 73, 75, -4, 28, 6],
  [519, 0, 148, 153, 15, -18, 6],
  [667, 0, 51, 228, 8, -30, -6],
  [718, 0, 96, 228, 20, 13, -4],
  [814, 0, 114, 228, 28, -8, 5],
  [0, 228, 928, 89, 0, 18, 0],
];

export function CorkLogo({ className = "", motion = false }: { className?: string; motion?: boolean }) {
  const id = useId().replace(/:/g, "");
  return <span className={"cork-logo " + (motion ? "cork-logo-motion " : "") + className} role="img" aria-label="The Cork restaurant, Wrocław">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img className="cork-logo-light cork-logo-original" src={assetPath("/branding/the-cork-teal.png")} alt="" />
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img className="cork-logo-dark cork-logo-original" src={assetPath("/branding/the-cork-white.png")} alt="" />
    {motion && <svg className="cork-logo-pieces" viewBox="0 0 928 317" aria-hidden="true" focusable="false">
      <defs>
        <image id={`${id}-art`} href={assetPath("/branding/the-cork-teal.png")} width="928" height="317" />
        <filter id={`${id}-outline`} x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
          <feMorphology in="SourceAlpha" operator="erode" radius="2" result="inside" />
          <feComposite in="SourceAlpha" in2="inside" operator="out" result="edge" />
          <feFlood floodColor="currentColor" />
          <feComposite in2="edge" operator="in" />
        </filter>
        <filter id={`${id}-ink`}><feFlood floodColor="currentColor" /><feComposite in2="SourceAlpha" operator="in" /></filter>
        {logoPieces.map(([x, y, width, height], i) => <clipPath id={`${id}-clip-${i}`} key={i}><rect x={x} y={y} width={width} height={height} /></clipPath>)}
      </defs>
      {logoPieces.map(([x, y, width, height, dx, dy, rotate], i) => <g key={i} className="cork-logo-piece" style={{ "--piece-x": `${dx}px`, "--piece-y": `${dy}px`, "--piece-rotation": `${rotate}deg`, transformOrigin: `${x + width / 2}px ${y + height / 2}px` } as CSSProperties}>
        <g clipPath={`url(#${id}-clip-${i})`}>
          <use href={`#${id}-art`} className="cork-piece-fill" filter={`url(#${id}-ink)`} />
          <use href={`#${id}-art`} className="cork-piece-outline" filter={`url(#${id}-outline)`} />
        </g>
      </g>)}
    </svg>}
  </span>;
}

function PlatelyMark() {
  return <svg className="plately-mark" viewBox="0 0 28 28" fill="none" aria-hidden="true" focusable="false">
    <circle cx="14" cy="14" r="11.5" stroke="currentColor" strokeWidth="1.4" />
    <circle cx="14" cy="14" r="7.2" stroke="currentColor" strokeWidth="1.4" />
    <path d="M9.8 14.2c1.4 2.5 5.8 4.1 8.8.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="19.4" cy="8.6" r="1.5" fill="currentColor" />
  </svg>;
}

export function PlatelyCredit({ placement = "side", animated = placement !== "footer" }: { placement?: "side" | "footer"; animated?: boolean }) {
  return <div className={`plately-credit plately-credit-${placement}${animated ? " plately-credit-animated" : ""}`} aria-label="Powered by Plately"><span className="plately-caption" aria-hidden="true">powered by</span><span className="plately-signature" aria-hidden="true"><PlatelyMark /><strong>plately<span className="plately-dot">.</span></strong></span></div>;
}

export function MenuEntryMotion() {
  return <div className="menu-entry-motion" aria-hidden="true"><CorkLogo motion className="menu-entry-logo" /></div>;
}

export function BrandLockup() {
  return <div className="brand-lockup"><PlatelyCredit /></div>;
}
