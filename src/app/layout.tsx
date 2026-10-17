import type { Metadata } from "next";
import "@fontsource-variable/cormorant-garamond";
import "@fontsource-variable/cormorant-garamond/wght-italic.css";
import "@fontsource-variable/manrope";
import "./globals.css";

export const metadata: Metadata = {
  title: "THE CORK — Karta Wrocław",
  description: "Odkryj sezonową kartę THE CORK. Rytuał oliwy, autorskie dania i dobre chwile przy stole. Rzeźnicza 32/33, Wrocław.",
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return <html lang="pl" data-theme="light" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html: "try{var theme=localStorage.getItem('cork-theme');document.documentElement.dataset.theme=theme==='dark'?'dark':'light'}catch(e){}"}} /></head><body>{children}</body></html>;
}
