import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Skip TS/ESLint during build (dev still checks)
  typescript: {
    ignoreBuildErrors: true,
  },
  // Static export configuration
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,  // Disable image optimization
  },
};

export default nextConfig;
