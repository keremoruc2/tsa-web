import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure trailing slashes are handled correctly
  trailingSlash: false,
  // Enable React strict mode for better development
  reactStrictMode: true,
  // Disable x-powered-by header for security
  poweredByHeader: false,
  // Allow optimized images from external sources
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
      { protocol: 'https', hostname: '*.blob.vercel-storage.com' },
    ],
  },
};

export default nextConfig;
