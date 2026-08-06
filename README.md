# Al Haddaf Mobile Car Wash 🚗✨

A premium, high-performance web application for Al Haddaf Mobile Car Wash, built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Prisma ORM** with **PostgreSQL**.

## Features

- **Dynamic Public Pages:** SEO-optimized, highly engaging landing pages for Services, Areas, and Blogs.
- **Admin Dashboard:** Full CMS to manage Services, Service Areas, Blog Posts, Reviews, and FAQs.
- **Rich Text Editing:** Integrated TipTap editor for managing blog posts and descriptions.
- **Drag and Drop:** Sortable interfaces using `@dnd-kit` for ordering services and areas.
- **Authentication:** Secure login for administrators using NextAuth v5.
- **Responsive Design:** Premium UI optimized for all devices, featuring Framer Motion micro-animations.
- **Serverless Database:** Runs on Cloudflare Workers via Hyperdrive + the Prisma PostgreSQL Adapter.

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/)
- **Language:** TypeScript
- **Database:** PostgreSQL (hosted via Supabase)
- **ORM:** [Prisma](https://www.prisma.io/) (with `@prisma/adapter-pg`)
- **Styling:** Tailwind CSS + custom UI components
- **Auth:** NextAuth.js (v5)
- **Deployment:** Cloudflare Workers via [OpenNext](https://opennext.js.org/cloudflare), Hyperdrive (DB), Cloudinary (image storage)

## Local Development

### 1. Prerequisites
- Node.js (v20+)
- npm or pnpm
- PostgreSQL Database URL

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Copy the example environment file and fill in your details:
```bash
cp .env.example .env
```
Ensure you have the following variables set in your `.env` file:
- `DATABASE_URL` (Connection pool URL)
- `DIRECT_URL` (Direct connection for Prisma migrations)
- `AUTH_SECRET` (A strong random secret for NextAuth)
- `ADMIN_EMAIL` & `ADMIN_PASSWORD` (For the initial admin account)

### 4. Database Setup
Generate the Prisma client and push the schema to your database:
```bash
npm run postinstall
npx prisma db push
```

*(Optional)* Seed the database with initial data:
```bash
npx prisma db seed
```

### 5. Start Development Server
```bash
npm run dev
```
Navigate to `http://localhost:3000` to view the app. The admin portal is located at `/admin`.

## Production Deployment (Cloudflare Workers)

This project deploys to Cloudflare Workers via [OpenNext](https://opennext.js.org/cloudflare). Cloudflare Workers can't open raw TCP connections to Postgres or use Vercel-style filesystem storage, so Hyperdrive (database) and an external image host are required before deploying.

### 1. Log in to Wrangler
```bash
npx wrangler login
```

### 2. Create Hyperdrive (database connectivity)
Hyperdrive proxies your Supabase Postgres connection so the existing `pg` + Prisma adapter code (`lib/db.ts`) works unchanged on Workers:
```bash
npx wrangler hyperdrive create al-haddaf-car-wash-db --connection-string="<your DATABASE_URL>"
```
Copy the returned `id` into the `[[hyperdrive]]` block in `wrangler.toml` (uncomment it), and set `localConnectionString` to the same value as your `DATABASE_URL` for local dev.

### 3. Set up Cloudinary (image uploads)
Handles service/area/blog/review images and the site logo/favicon (`lib/upload-image.ts`, signed uploads via plain `fetch()` — no SDK). Create a free account at [cloudinary.com](https://cloudinary.com), then grab `Cloud Name`, `API Key`, and `API Secret` from the dashboard (`cloudinary.com/console`) and set them as env vars (see `.env.example`).

An R2-based version of this is also scaffolded in `wrangler.toml` (commented out) as an alternative if you'd rather keep storage entirely on Cloudflare — it needs a one-time R2 activation in the dashboard first (`dash.cloudflare.com` → R2 Object Storage).

### 4. Set environment variables
Cloudflare doesn't auto-inject env vars like Vercel did. Set these as Worker secrets/vars (`npx wrangler secret put <NAME>`, or in the Cloudflare dashboard):
`DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, `AUTH_URL`/`NEXTAUTH_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `NEXT_PUBLIC_SITE_URL`.

### 5. Build and deploy
```bash
npm run deploy
```
Or preview locally against the real Workers runtime first:
```bash
npm run preview
```

### Local development
`npm run dev` (plain `next dev`) works as before — locally it talks to Postgres directly via `DATABASE_URL` rather than through Hyperdrive, since there's no Cloudflare Workers context outside a real deployment or `wrangler dev`/`preview`. Image uploads work locally too, as long as the Cloudinary env vars are set in `.env`.

## License
Private Property of Al Haddaf. All rights reserved.
