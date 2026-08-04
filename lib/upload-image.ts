import { getCloudflareContext } from '@opennextjs/cloudflare'

// Uploads a file to the "UPLOADS_BUCKET" R2 bucket (bound in wrangler.toml) and
// returns its public URL. Replaces the old Vercel Blob-based upload — R2 is
// Cloudflare's native object storage, reachable via a Workers binding, no SDK
// or extra credentials needed beyond the binding + a public bucket URL.
export async function uploadImage(file: File | null, prefix = 'uploads'): Promise<string | null> {
  if (!file || file.size === 0 || file.name === 'undefined') return null

  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
  const key = `${prefix}/${uniqueSuffix}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`

  const { env } = await getCloudflareContext({ async: true })
  const bucket = (env as { UPLOADS_BUCKET?: R2Bucket }).UPLOADS_BUCKET
  if (!bucket) {
    throw new Error(
      'UPLOADS_BUCKET (R2) binding is not configured — see wrangler.toml and README for setup steps.'
    )
  }

  await bucket.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type || 'application/octet-stream' },
  })

  const publicBaseUrl = process.env.R2_PUBLIC_URL
  if (!publicBaseUrl) {
    throw new Error('R2_PUBLIC_URL env var is not configured — see wrangler.toml and README for setup steps.')
  }

  return `${publicBaseUrl.replace(/\/$/, '')}/${key}`
}

// Minimal shape of the R2Bucket binding — avoids depending on @cloudflare/workers-types
// just for this one type. Matches the subset of the real Workers runtime API used here.
interface R2Bucket {
  put(key: string, value: ArrayBuffer, options?: { httpMetadata?: { contentType?: string } }): Promise<unknown>
}
