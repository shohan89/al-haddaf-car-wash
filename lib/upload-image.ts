// Uploads a file to Cloudinary via its signed upload REST API and returns the
// resulting public (HTTPS) URL. Implemented with plain fetch() + the Web
// Crypto API (both Workers-native) rather than Cloudinary's Node SDK, which
// assumes APIs Workers doesn't have. Needs CLOUDINARY_CLOUD_NAME,
// CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET set as env vars/secrets.
export async function uploadImage(file: File | null, prefix = 'uploads'): Promise<string | null> {
  if (!file || file.size === 0 || file.name === 'undefined') return null

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      'Cloudinary is not configured — set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET (see .env.example and README).'
    )
  }

  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
  const baseName = file.name.replace(/\.[^./\\]+$/, '').replace(/[^a-zA-Z0-9.-]/g, '_')
  const publicId = `${prefix}/${uniqueSuffix}-${baseName}`
  const timestamp = Math.floor(Date.now() / 1000)

  // Cloudinary signed uploads: sign every param except file/api_key/cloud_name/resource_type,
  // sorted alphabetically as `key=value&key2=value2`, with the API secret appended.
  const paramsToSign = { public_id: publicId, timestamp: String(timestamp) }
  const toSign =
    Object.keys(paramsToSign)
      .sort()
      .map((k) => `${k}=${paramsToSign[k as keyof typeof paramsToSign]}`)
      .join('&') + apiSecret
  const signature = await sha1Hex(toSign)

  const body = new FormData()
  body.append('file', file)
  body.append('public_id', publicId)
  body.append('timestamp', String(timestamp))
  body.append('api_key', apiKey)
  body.append('signature', signature)

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body,
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Cloudinary upload failed (${res.status}): ${text || res.statusText}`)
  }

  const data = (await res.json()) as { secure_url?: string }
  if (!data.secure_url) {
    throw new Error('Cloudinary upload succeeded but returned no secure_url.')
  }
  return data.secure_url
}

async function sha1Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(input))
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}
