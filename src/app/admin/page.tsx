"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/types";

const empty: Product = {
  id: "",
  slug: "",
  category: "starters",
  name: { pl: "", en: "", uk: "" },
  description: { pl: "", en: "", uk: "" },
  ingredients: { pl: "", en: "", uk: "" },
  allergens: { pl: "", en: "", uk: "" },
  price: 0,
  currency: "PLN",
  poster: "",
  referenceImages: [],
  video: null,
  videoStatus: "none",
  featured: false,
  available: true,
  sortOrder: 100,
  productType: "food",
  demo: true,
};

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [edit, setEdit] = useState<Product | null>(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data.products);
  }

  useEffect(() => {
    load();
  }, []);

  async function save() {
    if (!edit) return;
    setBusy(true);
    const payload = {
      ...edit,
      id: edit.id || crypto.randomUUID(),
      slug: edit.slug || edit.name.en.toLowerCase().replace(/\s+/g, "-"),
    };
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setBusy(false);
    setEdit(null);
    load();
  }

  async function upload(kind: "posters" | "refs" | "videos", file: File) {
    const form = new FormData();
    form.set("file", file);
    form.set("kind", kind);
    const res = await fetch("/api/upload", { method: "POST", body: form });
    const data = await res.json();
    if (!edit) return;
    if (kind === "videos") setEdit({ ...edit, video: data.url, videoStatus: "ready" });
    else if (kind === "posters") setEdit({ ...edit, poster: data.url });
    else setEdit({ ...edit, referenceImages: [...edit.referenceImages, data.url] });
  }

  async function generate(id: string) {
    setBusy(true);
    await fetch("/api/video/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: id }),
    });
    setBusy(false);
    load();
    if (edit?.id === id) {
      const p = await fetch(`/api/products/${id}`).then((r) => r.json());
      setEdit(p);
    }
  }

  async function translateField(field: "name" | "description" | "ingredients", from: "pl" | "en") {
    if (!edit) return;
    const q = edit[field][from];
    const targets = (["pl", "en", "uk"] as const).filter((l) => l !== from);
    const next = { ...edit[field] };
    for (const tl of targets) {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q, target: tl }),
      });
      const data = await res.json();
      next[tl] = data.text;
    }
    setEdit({ ...edit, [field]: next });
  }

  return (
    <div className="min-h-screen bg-[#123f39] p-6 text-[#f4efe6]">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <div>
          <p className="tracking-[0.4em]">THE CORK</p>
          <h1 className="serif text-4xl">Admin</h1>
        </div>
        <a href="/" className="text-sm text-[#b7aea0]">
          ← Menu
        </a>
      </div>

      <div className="mx-auto mt-8 grid max-w-6xl gap-8 md:grid-cols-2">
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setEdit({ ...empty, id: crypto.randomUUID() })}
            className="mb-4 border border-white/20 px-4 py-2 text-xs uppercase tracking-widest"
          >
            New product
          </button>
          {products.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between border-b border-white/10 py-3"
            >
              <div>
                <p>{p.name.en}</p>
                <p className="text-xs text-[#b7aea0]">
                  {p.category} · {p.price} {p.currency} · video {p.videoStatus}
                </p>
              </div>
              <div className="flex gap-2 text-xs">
                <button type="button" onClick={() => setEdit(p)}>
                  Edit
                </button>
                <button type="button" onClick={() => generate(p.id)} disabled={busy}>
                  Generate video
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await fetch(`/api/products/${p.id}`, { method: "DELETE" });
                    load();
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {edit && (
          <form
            className="space-y-3 border border-white/10 p-5"
            onSubmit={(e) => {
              e.preventDefault();
              save();
            }}
          >
            <Field label="Name PL" value={edit.name.pl} onChange={(v) => setEdit({ ...edit, name: { ...edit.name, pl: v } })} />
            <Field label="Name EN" value={edit.name.en} onChange={(v) => setEdit({ ...edit, name: { ...edit.name, en: v } })} />
            <Field label="Name UK" value={edit.name.uk} onChange={(v) => setEdit({ ...edit, name: { ...edit.name, uk: v } })} />
            <button type="button" className="text-xs text-[#c47a3a]" onClick={() => translateField("name", "en")}>
              Translate names via Google
            </button>
            <Field label="Description PL" value={edit.description.pl} onChange={(v) => setEdit({ ...edit, description: { ...edit.description, pl: v } })} />
            <Field label="Description EN" value={edit.description.en} onChange={(v) => setEdit({ ...edit, description: { ...edit.description, en: v } })} />
            <Field label="Description UK" value={edit.description.uk} onChange={(v) => setEdit({ ...edit, description: { ...edit.description, uk: v } })} />
            <button type="button" className="text-xs text-[#c47a3a]" onClick={() => translateField("description", "en")}>
              Translate descriptions via Google
            </button>
            <Field label="Ingredients PL" value={edit.ingredients.pl} onChange={(v) => setEdit({ ...edit, ingredients: { ...edit.ingredients, pl: v } })} />
            <Field label="Ingredients EN" value={edit.ingredients.en} onChange={(v) => setEdit({ ...edit, ingredients: { ...edit.ingredients, en: v } })} />
            <Field label="Ingredients UK" value={edit.ingredients.uk} onChange={(v) => setEdit({ ...edit, ingredients: { ...edit.ingredients, uk: v } })} />
            <Field label="Allergens PL" value={edit.allergens.pl} onChange={(v) => setEdit({ ...edit, allergens: { ...edit.allergens, pl: v } })} />
            <Field label="Allergens EN" value={edit.allergens.en} onChange={(v) => setEdit({ ...edit, allergens: { ...edit.allergens, en: v } })} />
            <Field label="Allergens UK" value={edit.allergens.uk} onChange={(v) => setEdit({ ...edit, allergens: { ...edit.allergens, uk: v } })} />
            <Field label="Price" value={String(edit.price)} onChange={(v) => setEdit({ ...edit, price: Number(v) })} />
            <label className="block text-xs uppercase tracking-widest text-[#b7aea0]">
              Category
              <select
                className="mt-1 w-full bg-transparent py-2"
                value={edit.category}
                onChange={(e) => setEdit({ ...edit, category: e.target.value as Product["category"] })}
              >
                {["ritual","starters","snacks","mains","meat","seafood","desserts"].map((c) => (
                  <option key={c} value={c} className="text-black">
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-xs">
              Sort order
              <input
                className="mt-1 w-full border-b border-white/20 bg-transparent py-1"
                type="number"
                value={edit.sortOrder}
                onChange={(e) => setEdit({ ...edit, sortOrder: Number(e.target.value) })}
              />
            </label>
            <label className="flex gap-2 text-sm">
              <input
                type="checkbox"
                checked={edit.available}
                onChange={(e) => setEdit({ ...edit, available: e.target.checked })}
              />
              Available
            </label>
            <label className="flex gap-2 text-sm">
              <input
                type="checkbox"
                checked={edit.featured}
                onChange={(e) => setEdit({ ...edit, featured: e.target.checked })}
              />
              Featured
            </label>
            <p className="text-xs text-[#b7aea0]">Poster</p>
            <input type="file" accept="image/*" onChange={(e) => e.target.files && upload("posters", e.target.files[0])} />
            <p className="text-xs text-[#b7aea0]">Reference images</p>
            <input type="file" accept="image/*" onChange={(e) => e.target.files && upload("refs", e.target.files[0])} />
            <p className="text-xs text-[#b7aea0]">Replace video</p>
            <input type="file" accept="video/*" onChange={(e) => e.target.files && upload("videos", e.target.files[0])} />
            <p className="text-xs">Status: {edit.videoStatus} {edit.videoError}</p>
            {edit.video && (
              <video src={edit.video} poster={edit.poster} controls className="w-full" muted />
            )}
            <div className="flex gap-3">
              <button type="submit" disabled={busy} className="bg-[#c47a3a] px-4 py-2 text-black">
                Save
              </button>
              <button type="button" onClick={() => generate(edit.id)} disabled={busy}>
                Generate / regenerate video
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block text-xs uppercase tracking-widest text-[#b7aea0]">
      {label}
      <input
        className="mt-1 w-full border-b border-white/20 bg-transparent py-1 text-sm text-[#f4efe6]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
