import { readFile, unlink } from "fs/promises";
import { execFile } from "child_process";
import { promisify } from "util";
import path from "path";
import { publicUrlToPath, savePublicFile } from "@/lib/storage";
import type { GenerateVideoInput, GenerateVideoResult, VideoProvider } from "../types";

const exec = promisify(execFile);

/** Local fallback: encode the poster as a 5s muted H.264 loop. */
export const stubProvider: VideoProvider = {
  id: "stub-poster-loop",
  async generate(input: GenerateVideoInput): Promise<GenerateVideoResult> {
    const src = publicUrlToPath(input.image);
    const tmp = path.join("/tmp", `cork-${Date.now()}.mp4`);
    await exec("ffmpeg", [
      "-y",
      "-loop",
      "1",
      "-i",
      src,
      "-t",
      String(input.duration || 5),
      "-vf",
      "scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280",
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      "-an",
      tmp,
    ]);
    const buf = await readFile(tmp);
    await unlink(tmp).catch(() => {});
    const videoUrl = await savePublicFile("videos", `loop-${Date.now()}.mp4`, buf);
    return { videoUrl, provider: "stub-poster-loop" };
  },
};
