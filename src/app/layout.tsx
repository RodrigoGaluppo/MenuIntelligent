import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Cork — Karta R32 Wrocław",
  description: "Odkryj sezonową kartę The Cork. Rytuał oliwy, autorskie dania i dobre chwile przy stole. Rzeźnicza 32/33, Wrocław.",
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return <html lang="pl"><body>{children}</body></html>;
}
