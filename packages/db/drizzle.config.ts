import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: "./.env.local" });

export default defineConfig({
  schema: "./schema.ts",
  out: "./drizzle/",
  dialect: "turso",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
});
