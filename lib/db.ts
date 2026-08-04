import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import { getCloudflareContext } from '@opennextjs/cloudflare'

// Resolves the Postgres connection string. On Cloudflare Workers this must be
// the Hyperdrive binding's connection string — Workers can't open raw TCP
// sockets to Supabase directly, Hyperdrive proxies that connection. Outside
// Workers (local `next dev`/`next build`, scripts) there is no Cloudflare
// request context, so this falls back to DATABASE_URL directly.
function resolveConnectionString(): string {
  try {
    const { env } = getCloudflareContext()
    const hyperdrive = (env as { HYPERDRIVE?: { connectionString: string } }).HYPERDRIVE
    if (hyperdrive?.connectionString) return hyperdrive.connectionString
  } catch {
    // Not running inside a Cloudflare Workers request (plain Node build/dev/scripts) — ignore.
  }
  return process.env.DATABASE_URL as string
}

function createPrismaClient(): PrismaClient {
  const pool = new pg.Pool({
    connectionString: resolveConnectionString(),
    max: 2, // Keep low for serverless/build environments
    idleTimeoutMillis: 3000,
  })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

declare global {
  var __prisma: PrismaClient | undefined
}

// Lazily create the real client on first use rather than at module load —
// on Cloudflare Workers, module top-level code can run before any request's
// Hyperdrive binding is available, so the connection must be resolved the
// first time a query actually happens (inside a Server Action/Component/Route
// Handler, which always run within a request). Every existing call site
// (`prisma.service.findMany()` etc.) keeps working unchanged.
function getPrismaClient(): PrismaClient {
  if (!globalThis.__prisma) {
    globalThis.__prisma = createPrismaClient()
  }
  return globalThis.__prisma
}

const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    return Reflect.get(getPrismaClient() as object, prop, receiver)
  },
})

export default prisma
