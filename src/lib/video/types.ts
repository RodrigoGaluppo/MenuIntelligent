export interface GenerateVideoInput {
  image: string;
  prompt: string;
  duration: number;
  aspectRatio: "9:16" | "16:9" | "1:1";
  productType: "food" | "drink";
}

export interface GenerateVideoResult {
  videoUrl: string;
  posterUrl?: string;
  provider: string;
  jobId?: string;
}

export interface VideoProvider {
  id: string;
  generate(input: GenerateVideoInput): Promise<GenerateVideoResult>;
  poll?(jobId: string): Promise<{ status: string; videoUrl?: string }>;
}
