import type { NextConfig } from "next";

const isPages = process.env.GITHUB_PAGES === "true";
const basePath = isPages ? (process.env.GITHUB_PAGES_BASE || "") : "";

const nextConfig: NextConfig = {
  ...(isPages ? { output: "export" as const } : {}),
  ... (basePath ? { basePath } : {}),
  trailingSlash: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
