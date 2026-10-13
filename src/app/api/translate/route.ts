import { NextResponse } from "next/server";

/** Google Translate (official if GOOGLE_TRANSLATE_API_KEY, else public gtx endpoint). */
export async function POST(req: Request) {
  const { q, target } = (await req.json()) as { q: string; target: string };
  if (!q || !target) {
    return NextResponse.json({ error: "q and target required" }, { status: 400 });
  }

  const key = process.env.GOOGLE_TRANSLATE_API_KEY;
  if (key) {
    const res = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q, target, format: "text" }),
      }
    );
    const data = await res.json();
    const text = data?.data?.translations?.[0]?.translatedText ?? q;
    return NextResponse.json({ text, provider: "google-cloud" });
  }

  const url = new URL("https://translate.googleapis.com/translate_a/single");
  url.searchParams.set("client", "gtx");
  url.searchParams.set("sl", "auto");
  url.searchParams.set("tl", target);
  url.searchParams.set("dt", "t");
  url.searchParams.set("q", q);
  const res = await fetch(url.toString());
  if (!res.ok) {
    return NextResponse.json({ text: q, provider: "passthrough" });
  }
  const data = await res.json();
  const text = Array.isArray(data?.[0])
    ? data[0].map((chunk: [string]) => chunk[0]).join("")
    : q;
  return NextResponse.json({ text, provider: "google-gtx" });
}
