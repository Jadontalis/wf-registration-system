import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts'],
  },
  images : {
    remotePatterns : [
      {
        protocol : 'https',
        hostname : 'placehold.co',
      }
    ]
  }
};

export default nextConfig;
