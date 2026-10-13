import { mkdir, writeFile } from "fs/promises";
import path from "path";

const ROOT = path.join(process.cwd(), "public", "media");

export async function savePublicFile(
  folder: "posters" | "videos" | "refs",
  filename: string,
  buffer: Buffer
) {
  const dir = path.join(ROOT, folder);
  await mkdir(dir, { recursive: true });
  const dest = path.join(dir, filename);
  await writeFile(dest, buffer);
  return `/media/${folder}/${filename}`;
}

export function publicUrlToPath(url: string) {
  return path.join(process.cwd(), "public", url.replace(/^\//, ""));
}
