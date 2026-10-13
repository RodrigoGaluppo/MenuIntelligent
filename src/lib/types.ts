export type Locale = "pl" | "en" | "uk";

export type VideoStatus =
  | "none"
  | "queued"
  | "generating"
  | "processing"
  | "ready"
  | "failed";

export type CategoryId =
  | "ritual"
  | "starters"
  | "snacks"
  | "mains"
  | "meat"
  | "seafood"
  | "desserts";

export interface Localized {
  pl: string;
  en: string;
  uk: string;
}

export interface Product {
  id: string;
  slug: string;
  category: CategoryId;
  name: Localized;
  description: Localized;
  ingredients: Localized;
  allergens: Localized;
  weight?: string;
  variants?: { label: string; price: number }[];
  addOns?: { label: Localized; weight: string; price: number }[];
  price: number;
  currency: string;
  poster: string;
  referenceImages: string[];
  video: string | null;
  videoStatus: VideoStatus;
  videoError?: string | null;
  featured: boolean;
  available: boolean;
  sortOrder: number;
  productType: "food" | "drink";
  demo: true;
}

export interface Restaurant {
  id: string;
  name: string;
  tagline: Localized;
  city: Localized;
  fictional: boolean;
  currency: string;
  address: Localized;
  wifiName: string;
  wifiPassword: string;
  hours: Localized;
  phone: string;
}
