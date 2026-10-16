import type { ReactNode, SVGProps } from "react";

type IconName = "wifi" | "menu" | "phone" | "star" | "external" | "chevron" | "back" | "close" | "play" | "pause" | "info" | "sun" | "moon";

export function Icon({ name, ...props }: SVGProps<SVGSVGElement> & { name: IconName }) {
  const shared = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const paths: Record<IconName, ReactNode> = {
    wifi: <><path d="M2.5 8.5a15 15 0 0 1 19 0M5.5 12a10 10 0 0 1 13 0M8.5 15.5a5.5 5.5 0 0 1 7 0"/><circle cx="12" cy="19" r="1" fill="currentColor" stroke="none"/></>,
    menu: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    phone: <path d="M7.2 3.5 4.7 5.2c-.8.6-1.2 1.5-.9 2.5a19 19 0 0 0 12.5 12.5c1 .3 1.9-.1 2.5-.9l1.7-2.5-4.2-3.3-2.1 1.6a15 15 0 0 1-5.8-5.8l1.6-2.1-3.3-4.2Z"/>,
    star: <path d="m12 2.5 2.8 6.2 6.7.8-5 4.6 1.3 6.6-5.8-3.3-5.8 3.3 1.3-6.6-5-4.6 6.7-.8L12 2.5Z"/>,
    external: <path d="M5 19 19 5M9 5h10v10"/>,
    chevron: <path d="m5 9 7 7 7-7"/>,
    back: <path d="M20 12H4m0 0 6-6m-6 6 6 6"/>,
    close: <path d="M5 5 19 19M19 5 5 19"/>,
    play: <path d="m8 5 11 7-11 7V5Z" fill="currentColor" stroke="none"/>,
    pause: <path d="M8 5v14M16 5v14" strokeWidth="3"/>,
    info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></>,
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></>,
    moon: <path d="M20.2 15.8A8.7 8.7 0 0 1 8.2 3.8 8.7 8.7 0 1 0 20.2 15.8Z"/>,
  };
  return <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false" {...shared} {...props}>{paths[name]}</svg>;
}
