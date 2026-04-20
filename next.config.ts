import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack trên Next 16 rất mạnh, không cần config thêm
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

