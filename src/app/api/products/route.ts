import { NextResponse } from "next/server";
import { listProducts, upsertProduct, getStore } from "@/lib/db";
import type { Product } from "@/lib/types";

export async function GET() {
  const store = await getStore();
  const products = await listProducts();
  return NextResponse.json({ restaurant: store.restaurant, products });
}

export async function POST(req: Request) {
  const body = (await req.json()) as Product;
  const product = await upsertProduct({
    ...body,
    id: body.id || crypto.randomUUID(),
    slug: body.slug || body.id,
    demo: true,
    currency: body.currency || "PLN",
    videoStatus: body.videoStatus || "none",
    available: body.available ?? true,
    featured: body.featured ?? false,
    sortOrder: body.sortOrder ?? 999,
    referenceImages: body.referenceImages ?? [],
  });
  return NextResponse.json(product);
}
