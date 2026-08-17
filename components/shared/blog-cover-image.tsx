'use client';

import { useState } from 'react';
import Image from 'next/image';

// Collapses entirely (rather than showing a placeholder) when the stored
// cover image URL 404s — some older posts still reference paths from
// storage this project no longer uses (Vercel Blob).
export function BlogCoverImage({ src, alt }: { src: string; alt: string }) {
  const [broken, setBroken] = useState(false);
  if (broken) return null;

  return (
    <div className="container-premium max-w-5xl mb-16">
      <div className="relative aspect-21/9 w-full rounded-3xl overflow-hidden shadow-premium">
        <Image src={src} alt={alt} fill className="object-cover" priority onError={() => setBroken(true)} />
      </div>
    </div>
  );
}
