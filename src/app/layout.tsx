import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "THE CORK — Karta Wrocław",
  description: "Odkryj sezonową kartę THE CORK. Rytuał oliwy, autorskie dania i dobre chwile przy stole. Rzeźnicza 32/33, Wrocław.",
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return <html lang="pl" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html: "try{var theme=localStorage.getItem('cork-theme');if(theme==='light'||theme==='dark')document.documentElement.dataset.theme=theme}catch(e){}"}} /></head><body>{children}</body></html>;
}
