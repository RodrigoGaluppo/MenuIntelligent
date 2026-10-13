import { NextResponse } from "next/server";
import { savePublicFile } from "@/lib/storage";

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file");
  const kind = (form.get("kind") as string) || "posters";
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file required" }, { status: 400 });
  }
  const buf = Buffer.from(await file.arrayBuffer());
  const ext = file.name.split(".").pop() || "bin";
  const folder = kind === "videos" ? "videos" : kind === "refs" ? "refs" : "posters";
  const url = await savePublicFile(folder, `${Date.now()}-${file.name.replace(/\s+/g, "-")}`, buf);
  return NextResponse.json({ url, ext });
}
