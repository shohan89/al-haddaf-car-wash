import "dotenv/config";
import { defineConfig } from "prisma/config";

// DATABASE_URL is only required for migrate/db-push commands, not for `prisma generate`.
// Making the datasource conditional prevents PrismaConfigEnvError during `npm install`
// on Vercel (postinstall runs prisma generate before env vars are available).
export default defineConfig({
  schema: "prisma/schema.prisma",
  ...(process.env.DATABASE_URL
    ? {
        datasource: {
          url: process.env.DATABASE_URL,
          directUrl: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
        },
      }
    : {}),
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});
