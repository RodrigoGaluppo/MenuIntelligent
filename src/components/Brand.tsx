import { assetPath } from "@/lib/assets";

export function CorkLogo({ className = "" }: { className?: string }) {
  return <span className={"cork-logo " + className} role="img" aria-label="The Cork restaurant, Wrocław">
    {/* The restaurant's own wordmark has a teal and a white version. */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img className="cork-logo-light" src={assetPath("/branding/the-cork-teal.png")} alt="" />
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img className="cork-logo-dark" src={assetPath("/branding/the-cork-white.png")} alt="" />
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

export function PlatelyCredit() {
  return <div className="plately-credit"><span className="plately-caption">powered by</span><span className="plately-signature"><PlatelyMark /><strong>plately<span className="plately-dot">.</span></strong></span></div>;
}

export function BrandLockup() {
  return <div className="brand-lockup"><div className="cork-identity"><CorkLogo /><small>WROCŁAW</small></div><PlatelyCredit /></div>;
}
