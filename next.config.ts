import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["three", "@react-three/fiber"], // Required for WebGL/Three.js
  experimental: {
    esmExternals: "loose", // Helps with ESM/CJS conflicts
  },
};

export default nextConfig;
