import "dotenv/config";
import { defineConfig } from "prisma/config";

// Connection info lives in schema.prisma's datasource block (url/directUrl via
// env()), not here — keeps this file version-stable across Prisma releases.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});
