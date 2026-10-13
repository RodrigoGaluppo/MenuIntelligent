import { readFile } from "fs/promises";
import { publicUrlToPath, savePublicFile } from "@/lib/storage";
import type { GenerateVideoInput, GenerateVideoResult, VideoProvider } from "../types";

/**
 * xAI / Grok image-to-video provider.
 * Credentials stay server-side (XAI_API_KEY).
 */
export const grokProvider: VideoProvider = {
  id: "grok",
  async generate(input: GenerateVideoInput): Promise<GenerateVideoResult> {
    const key = process.env.XAI_API_KEY;
    if (!key) {
      throw new Error("XAI_API_KEY is not set. Native image-to-video cannot run.");
    }

    const imagePath = input.image.startsWith("http")
      ? input.image
      : publicUrlToPath(input.image);
    const bytes = await readFile(imagePath);
    const b64 = bytes.toString("base64");

    const res = await fetch("https://api.x.ai/v1/videos/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.XAI_VIDEO_MODEL || "grok-imagine-video",
        prompt: input.prompt,
        image: { b64_json: b64 },
        duration: input.duration,
        aspect_ratio: input.aspectRatio,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Grok video failed: ${res.status} ${text}`);
    }

    const data = (await res.json()) as {
      id?: string;
      url?: string;
      video?: { url?: string; b64_json?: string };
    };

    if (data.video?.b64_json) {
      const buf = Buffer.from(data.video.b64_json, "base64");
      const videoUrl = await savePublicFile(
        "videos",
        `gen-${Date.now()}.mp4`,
        buf
      );
      return { videoUrl, provider: "grok", jobId: data.id };
    }

    const remote = data.url || data.video?.url;
    if (!remote) throw new Error("Grok video response had no URL");
    const file = await fetch(remote);
    const buf = Buffer.from(await file.arrayBuffer());
    const videoUrl = await savePublicFile("videos", `gen-${Date.now()}.mp4`, buf);
    return { videoUrl, provider: "grok", jobId: data.id };
  },
};
