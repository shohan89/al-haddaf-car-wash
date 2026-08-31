'use client';

import { getUploadSignature } from '@/actions/upload-actions';
import { recordMediaAsset } from '@/actions/media-actions';

interface CloudinaryUploadResponse {
  secure_url?: string;
  public_id?: string;
  format?: string;
  width?: number;
  height?: number;
  bytes?: number;
}

// Uploads straight from the browser to Cloudinary using a short-lived signature
// from the server. The image bytes never pass through our Cloudflare Worker.
export async function uploadToCloudinary(file: File, prefix = 'uploads'): Promise<string> {
  const sig = await getUploadSignature(file.name, prefix);

  const body = new FormData();
  body.append('file', file);
  body.append('public_id', sig.publicId);
  body.append('timestamp', String(sig.timestamp));
  body.append('api_key', sig.apiKey);
  body.append('signature', sig.signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`, {
    method: 'POST',
    body,
  });
  if (!res.ok) throw new Error(`Upload failed (${res.status})`);

  const data = (await res.json()) as CloudinaryUploadResponse;
  if (!data.secure_url) throw new Error('Upload succeeded but no URL was returned');

  if (data.public_id) {
    recordMediaAsset({
      url: data.secure_url,
      publicId: data.public_id,
      filename: file.name,
      mimeType: file.type || undefined,
      width: data.width,
      height: data.height,
      size: data.bytes,
    }).catch((err) => console.error('Failed to record media asset:', err));
  }

  return data.secure_url;
}
