import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import type { Product, Restaurant } from "./types";
import { seed } from "./seed";

const FILE = path.join(process.cwd(), "data", "menu.json");

interface Store {
  restaurant: Restaurant;
  products: Product[];
}

async function ensure(): Promise<Store> {
  try {
    const raw = await readFile(FILE, "utf8");
    return JSON.parse(raw) as Store;
  } catch {
    await mkdir(path.dirname(FILE), { recursive: true });
    await writeFile(FILE, JSON.stringify(seed, null, 2));
    return seed;
  }
}

async function persist(store: Store) {
  await mkdir(path.dirname(FILE), { recursive: true });
  await writeFile(FILE, JSON.stringify(store, null, 2));
}

export async function getStore() {
  return ensure();
}

export async function listProducts() {
  const s = await ensure();
  return [...s.products].sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getProduct(id: string) {
  const s = await ensure();
  return s.products.find((p) => p.id === id || p.slug === id) ?? null;
}

export async function upsertProduct(product: Product) {
  const s = await ensure();
  const i = s.products.findIndex((p) => p.id === product.id);
  if (i >= 0) s.products[i] = product;
  else s.products.push(product);
  await persist(s);
  return product;
}

export async function deleteProduct(id: string) {
  const s = await ensure();
  s.products = s.products.filter((p) => p.id !== id);
  await persist(s);
}

export async function patchProduct(id: string, patch: Partial<Product>) {
  const s = await ensure();
  const i = s.products.findIndex((p) => p.id === id);
  if (i < 0) return null;
  s.products[i] = { ...s.products[i], ...patch };
  await persist(s);
  return s.products[i];
}
