import { NextResponse } from "next/server";
import { getProduct, patchProduct } from "@/lib/db";
import { generateProductVideo } from "@/lib/video/generateProductVideo";
import { MASTER_DRINK_VIDEO_PROMPT, MASTER_FOOD_VIDEO_PROMPT } from "@/lib/video/prompts";

export async function POST(req: Request) {
  const { productId } = (await req.json()) as { productId: string };
  const product = await getProduct(productId);
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await patchProduct(product.id, { videoStatus: "queued" });
  await patchProduct(product.id, { videoStatus: "generating" });

  try {
    await patchProduct(product.id, { videoStatus: "processing" });
    const result = await generateProductVideo({
      image: product.poster || product.referenceImages[0],
      prompt:
        product.productType === "drink"
          ? MASTER_DRINK_VIDEO_PROMPT
          : MASTER_FOOD_VIDEO_PROMPT,
      duration: 5,
      aspectRatio: "9:16",
      productType: product.productType,
    });
    const updated = await patchProduct(product.id, {
      video: result.videoUrl,
      videoStatus: "ready",
      videoError: null,
    });
    return NextResponse.json(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Generation failed";
    await patchProduct(product.id, { videoStatus: "failed", videoError: message });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
