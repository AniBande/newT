import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true, // ✅ This will allow deployment even if ESLint errors exist
  },
};

export default nextConfig;
