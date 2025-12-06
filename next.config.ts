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
        hostname: '*.booking.com',
      },
      {
        protocol: 'https',
        hostname: '*.expedia.com',
      },
      {
        protocol: 'https',
        hostname: '*.hotels.com',
      },
      {
        protocol: 'https',
        hostname: '*.trvl-media.com',
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
