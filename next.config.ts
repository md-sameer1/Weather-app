import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["cdn.weatherapi.com"],
  },
  reactStrictMode: true,
};

export default nextConfig;
