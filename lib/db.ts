// Explicitly the "wasm" build (not the bare '@prisma/client' entry): with
// engineType="client" it's the one that loads its query compiler via a real
// `import()` of a .wasm module — Workers-native and bundler-detectable. The
// default entry resolves per-runtime export conditions that our bundling
// pipeline doesn't consistently honor, and falls back to a runtime
// `fs.readFile()` for the same file, which doesn't exist on Workers.
import { PrismaClient } from '@prisma/client/wasm'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import { getCloudflareContext } from '@opennextjs/cloudflare'

function createPrismaClient(connectionString: string): PrismaClient {
  const pool = new pg.Pool({
    connectionString,
    max: 2, // Keep low for serverless/build environments
    idleTimeoutMillis: 3000,
  })
  // Without this, a connection dropped server-side (e.g. Hyperdrive recycling
  // it) surfaces as an unhandled 'error' event and can hang the next query
  // instead of failing it cleanly.
  pool.on('error', (err) => console.error('pg pool error:', err))
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

declare global {
  var __prisma: PrismaClient | undefined
}

// On Cloudflare Workers, one client per request — keyed off the Cloudflare
// request context object, which OpenNext scopes per-request. This lets
// multiple queries within a single request share a connection, while never
// reusing a pool across requests: Hyperdrive pools connections on its own
// end and can recycle them between requests, and reusing a pg.Pool built on
// top of a since-recycled connection hangs instead of failing cleanly.
const clientsByRequestContext = new WeakMap<object, PrismaClient>()

function getPrismaClient(): PrismaClient {
  let context: { env: unknown } | null = null
  try {
    context = getCloudflareContext()
  } catch {
    // Not running inside a Cloudflare Workers request (plain Node build/dev/scripts).
  }

  if (context) {
    const hyperdrive = (context.env as { HYPERDRIVE?: { connectionString: string } }).HYPERDRIVE
    if (hyperdrive?.connectionString) {
      let client = clientsByRequestContext.get(context)
      if (!client) {
        client = createPrismaClient(hyperdrive.connectionString)
        clientsByRequestContext.set(context, client)
      }
      return client
    }
  }

  // Local Node (dev/build/scripts): cache across hot-reloads as usual.
  if (!globalThis.__prisma) {
    globalThis.__prisma = createPrismaClient(process.env.DATABASE_URL as string)
  }
  return globalThis.__prisma
}

const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    return Reflect.get(getPrismaClient() as object, prop, receiver)
  },
})

export default prisma
