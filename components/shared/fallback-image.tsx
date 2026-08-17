'use client';

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface FallbackImageProps extends Omit<ImageProps, 'onError' | 'src'> {
  src: string | null | undefined;
  fallbackClassName?: string;
}

// Some older posts/services/areas still reference image paths from storage
// providers this project no longer uses (Vercel Blob), which now 404. Swap
// those out for a placeholder instead of letting the browser render a
// broken-image icon with the alt text bleeding into the layout.
export function FallbackImage({ src, fallbackClassName, ...props }: FallbackImageProps) {
  const [broken, setBroken] = useState(false);

  if (!src || broken) {
    return (
      <div className={fallbackClassName ?? 'absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-100'}>
        No Image
      </div>
    );
  }

  return <Image {...props} src={src} onError={() => setBroken(true)} />;
}
