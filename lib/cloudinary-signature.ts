export interface CloudinarySignature {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  publicId: string;
  signature: string;
}

// Generates params for a Cloudinary signed upload the browser can POST directly
// to api.cloudinary.com — the image bytes never pass through our server, so
// the request our Worker actually handles stays tiny and text-only.
export async function createCloudinarySignature(filename: string, prefix = 'uploads'): Promise<CloudinarySignature> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      'Cloudinary is not configured — set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET (see .env.example and README).'
    );
  }

  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const baseName = filename.replace(/\.[^./\\]+$/, '').replace(/[^a-zA-Z0-9.-]/g, '_');
  const publicId = `${prefix}/${uniqueSuffix}-${baseName}`;
  const timestamp = Math.floor(Date.now() / 1000);

  // Cloudinary signed uploads: sign every param except file/api_key/cloud_name/resource_type,
  // sorted alphabetically as `key=value&key2=value2`, with the API secret appended.
  const paramsToSign = { public_id: publicId, timestamp: String(timestamp) };
  const toSign =
    Object.keys(paramsToSign)
      .sort()
      .map((k) => `${k}=${paramsToSign[k as keyof typeof paramsToSign]}`)
      .join('&') + apiSecret;
  const signature = await sha1Hex(toSign);

  return { cloudName, apiKey, timestamp, publicId, signature };
}

async function sha1Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(input));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Permanently removes an asset from Cloudinary storage (used when deleting a
// Media Library entry). Server-only — needs the API secret.
export async function deleteCloudinaryAsset(publicId: string): Promise<void> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary is not configured.');
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const toSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  const signature = await sha1Hex(toSign);

  const body = new URLSearchParams({
    public_id: publicId,
    timestamp: String(timestamp),
    api_key: apiKey,
    signature,
  });

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Cloudinary delete failed (${res.status}): ${text || res.statusText}`);
  }
}
