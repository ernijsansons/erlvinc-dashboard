import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  reactStrictMode: true,
  typescript: {
    tsconfigPath: "./tsconfig.json",
  },
  images: {
    unoptimized: true,
  },
  // Skip API routes during static export
  trailingSlash: true,
};

export default nextConfig;
