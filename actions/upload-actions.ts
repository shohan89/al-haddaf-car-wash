'use server';

import { createCloudinarySignature } from '@/lib/cloudinary-signature';

// Called from the browser right before it uploads a file directly to
// Cloudinary. Keeping the image bytes out of the request body here matters:
// forwarding a File through a Next.js Server Action on Cloudflare Workers can
// hang the whole request, since the multipart body parsing runs inside the
// Workers runtime before our code ever gets to run.
export async function getUploadSignature(filename: string, prefix = 'uploads') {
  return createCloudinarySignature(filename, prefix);
}
