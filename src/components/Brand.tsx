export function CorkMark({ className = "" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true" focusable="false">
    <circle cx="24" cy="24" r="21" stroke="currentColor" strokeWidth="1.25" opacity=".7" />
    <path d="M32.7 15.8a13 13 0 1 0 .1 16.3" stroke="currentColor" strokeWidth="3.1" strokeLinecap="round" />
    <path d="M31.6 12.5c3.9-2.9 7.1-2 8.5-1.1-1.1 4.1-3.5 6.1-7.3 6.4" fill="currentColor" />
    <path d="M34.8 34.6h4.3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>;
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

export function BrandLockup({ compact = false }: { compact?: boolean }) {
  return <div className={"brand-lockup " + (compact ? "brand-lockup-compact" : "")}>
    <div className="cork-identity"><CorkMark /><span>THE CORK<small>R32 · WROCŁAW</small></span></div>
    <PlatelyCredit />
  </div>;
}
