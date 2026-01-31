import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Run ESLint separately via `npm run lint` (avoids deprecated next lint)
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Allow external images from various sources
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cymbal-shops.retail.cymbal.dev',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.ray-ban.com',
      },
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
      },
      // Allow all HTTPS images (for development/demo purposes)
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Stub optional peer deps from @standard-community/standard-json
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      effect: false,
      sury: false,
      "@valibot/to-json-schema": false,
    };
    return config;
  },
};

export default nextConfig;
