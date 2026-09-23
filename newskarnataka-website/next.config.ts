import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'strapi.opusinfiniti.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
