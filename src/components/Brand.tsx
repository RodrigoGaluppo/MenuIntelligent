import { assetPath } from "@/lib/assets";

const logoPieces: { id: string; paths: string[] }[] = [
  { id: "t", paths: ["M8 60 H76", "M42 60 V146"] },
  { id: "fork", paths: ["M120 8 V72", "M130 8 V70", "M139 8 V70", "M149 8 V72", "M118 72 H151", "M134 72 V194"] },
  { id: "knife", paths: ["M198 8 C188 28 180 58 183 100 C186 146 190 176 196 196", "M200 22 C198 78 197 140 196 194"] },
  { id: "e", paths: ["M250 58 H302", "M250 58 V146", "M250 102 H290", "M250 146 H302"] },
  { id: "c", paths: ["M498 66 C452 46 420 74 426 104 C432 142 466 158 502 136"] },
  { id: "o", paths: ["M611 51.5 A50 50.5 0 1 0 611 152.5", "M611 152.5 A50 50.5 0 1 0 611 51.5"] },
  { id: "seal", paths: ["M550.5 158 A28.5 28.5 0 1 0 550.5 215", "M550.5 215 A28.5 28.5 0 1 0 550.5 158"] },
  { id: "bubble", paths: ["M692 33.5 A20 20 0 1 0 692 73.5", "M692 73.5 A20 20 0 1 0 692 33.5"] },
  { id: "r", paths: ["M734 148 V58 H762 C784 58 786 84 766 94", "M748 94 H766", "M762 94 L786 148"] },
  { id: "k", paths: ["M860 56 V148", "M908 58 L864 104 L910 148"] },
  { id: "tagline", paths: ["M10 272 H914", "M10 288 H914", "M10 304 H914"] },
];

function LogoArtwork({ motion }: { motion: boolean }) {
  return logoPieces.map((piece) => <span className={"cork-logo-piece cork-logo-piece-" + piece.id} key={piece.id}>
    {/* Each layer crops the restaurant's official wordmark. */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img className="cork-logo-light" src={assetPath("/branding/the-cork-teal.png")} alt="" />
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img className="cork-logo-dark" src={assetPath("/branding/the-cork-white.png")} alt="" />
    {motion && <svg className="cork-logo-wire" viewBox="0 0 928 317" fill="none" aria-hidden="true" focusable="false">
      {piece.paths.map((d) => <path key={d} d={d} pathLength={1} />)}
    </svg>}
  </span>);
}

export function CorkLogo({ className = "", motion = false }: { className?: string; motion?: boolean }) {
  const classes = ["cork-logo", motion ? "is-motion" : "", className].filter(Boolean).join(" ");
  return <span className={classes} role="img" aria-label="The Cork">
    <LogoArtwork motion={motion} />
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

export function PlatelyCredit({ placement = "side" }: { placement?: "side" | "footer" }) {
  const typed = placement === "side";
  const letters = "plately.".split("");
  return <div className={"plately-credit plately-credit-" + placement} role="img" aria-label="Powered by Plately">
    <span className="plately-caption" aria-hidden="true">powered by</span>
    <span className="plately-signature" aria-hidden="true">
      <PlatelyMark />
      <strong className={"plately-word" + (typed ? " is-typed" : "")} aria-hidden="true">
        {letters.map((letter, index) => <span className={letter === "." ? "plately-dot" : undefined} key={index} style={typed ? { animationDelay: `${0.55 + index * 0.2}s` } : undefined}>{letter}</span>)}
      </strong>
    </span>
  </div>;
}

export function BrandLockup() {
  return <div className="brand-lockup"><CorkLogo className="header-cork-logo" motion /><PlatelyCredit placement="side" /></div>;
}
