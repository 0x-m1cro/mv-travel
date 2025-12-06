import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: 'static.cupid.travel',
      },
      {
        protocol: 'https',
        hostname: 'photos.hotelbeds.com',
      },
      {
        protocol: 'https',
        hostname: '*.liteapi.travel',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'cf.bstatic.com',
      },
      {
        protocol: 'https',
        hostname: '*.nuitee.com',
      },
    ],
  },
};

export default nextConfig;
