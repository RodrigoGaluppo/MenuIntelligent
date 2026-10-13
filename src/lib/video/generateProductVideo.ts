import { MASTER_DRINK_VIDEO_PROMPT, MASTER_FOOD_VIDEO_PROMPT } from "./prompts";
import { grokProvider } from "./providers/grok";
import { stubProvider } from "./providers/stub";
import type { GenerateVideoInput, GenerateVideoResult, VideoProvider } from "./types";

const providers: Record<string, VideoProvider> = {
  grok: grokProvider,
  runway: grokProvider,
  kling: grokProvider,
  veo: grokProvider,
  seedance: grokProvider,
  stub: stubProvider,
};

export async function generateProductVideo(
  input: GenerateVideoInput
): Promise<GenerateVideoResult> {
  const prompt =
    input.prompt ||
    (input.productType === "drink"
      ? MASTER_DRINK_VIDEO_PROMPT
      : MASTER_FOOD_VIDEO_PROMPT);

  const preferred = process.env.VIDEO_PROVIDER || "grok";
  const provider =
    (process.env.XAI_API_KEY ? providers[preferred] : null) || stubProvider;

  return provider.generate({ ...input, prompt });
}
