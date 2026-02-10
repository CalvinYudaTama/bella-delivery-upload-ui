import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // GCP Storage - allow all buckets (new and old files)
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      // R2 Storage
      {
        protocol: 'https',
        hostname: 'pub-e91c7c2fa3e945aea96c2bae219a331c.r2.dev',
        port: '',
        pathname: '/**',
      },
      // Picsum Photos - for demo/mock images
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
    // loader: 'custom',
    // loaderFile: './imageLoader.ts', // COMMENTED OUT: Not needed for demo, imageLoader.ts doesn't exist
  },
  async rewrites() {
    if (process.env.NODE_ENV === 'production') {
    return [
      {
        source: '/api/cloudflare-image/:path*',
        destination: 'https://bellavirtualstaging.com/cdn-cgi/image/:path*',
      },
    ];
    }
    return [];
  },
  typedRoutes: true,

  poweredByHeader: false,
  
  // Increase body size limit for file uploads (default is 10MB for Edge Runtime)
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
};

export default nextConfig;
