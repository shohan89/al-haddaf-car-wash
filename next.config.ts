import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  // Let OpenNext's Cloudflare-aware bundler (not Next's own webpack build)
  // resolve @prisma/client — it correctly picks Prisma's lean Workers/edge
  // build (~180KB) instead of the ~4.8MB base64-inlined WASM fallback that
  // gets pulled in otherwise, which alone blows the Workers size limit.
  serverExternalPackages: ['@prisma/client', '.prisma/client'],
  // Prisma's driver-adapter client loads its query compiler via a runtime
  // fs.readFile() call, which Next's static file-tracing can't detect as a
  // dependency — without this, the .wasm file silently never gets copied
  // into the deployed bundle at all ("no such file or directory" at runtime).
  outputFileTracingIncludes: {
    '**/*': ['./node_modules/.prisma/client/*.wasm'],
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
// Dev-only: calling this during `next build` (CI, `npm run build:cf`, etc.)
// tries to emulate bindings that only make sense for a live dev server, and
// throws if a local Hyperdrive connection string isn't configured for it.
if (process.env.NODE_ENV === 'development') {
  initOpenNextCloudflareForDev();
}

export default nextConfig;
