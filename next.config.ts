import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: "/admin_api/:path*",
        destination: "https://api.insuraa.in/:path*",
      },
    ];
  },
};

export default nextConfig;
