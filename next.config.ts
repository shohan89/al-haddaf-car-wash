import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  async rewrites() {
    return [
      { source: "/interior-detailing", destination: "/interior-detailing/index.html" },
      { source: "/car-wash-dubai", destination: "/car-wash-dubai/index.html" },
    ];
  },
  images: {
    // OpenNext's Cloudflare adapter doesn't run Next's built-in Node image
    // optimizer. Uploaded images are already compressed/resized client-side
    // before upload (see lib/compress-image.ts), so serving them as-is keeps
    // things simple and reliable without needing Cloudflare Images.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        // Default public R2.dev bucket domain. Replace with your bucket's
        // actual public hostname (r2.dev subdomain or custom domain) once
        // the R2 bucket is created — see wrangler.toml.
        protocol: 'https',
        hostname: '*.r2.dev',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

// Gives local `next dev` access to Cloudflare bindings (Hyperdrive, R2, etc.)
// via wrangler's local emulation, matching production behavior under OpenNext.
initOpenNextCloudflareForDev();

export default nextConfig;
