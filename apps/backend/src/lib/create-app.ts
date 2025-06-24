import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import type { R2Bucket } from "@cloudflare/workers-types";
import { YDurableObjects } from "y-durableobjects";
import { clerkMiddleware } from "@hono/clerk-auth";

type Bindings = {
  DATABASE_URL: string;
  DATABASE_AUTH_TOKEN: string;
  OPENAI_API_KEY: string;
  GEMINI_API_KEY: string;
  IMAGE_STORAGE_URL: string;
  litarchive: R2Bucket;
  Y_DURABLE_OBJECTS: DurableObjectNamespace<YDurableObjects<Env>>;
};

export type Env = {
  Bindings: Bindings;
};

export function createRouter() {
  return new OpenAPIHono<Env>({
    strict: false,
  });
}

export default function createApp() {
  const app = createRouter();
  app.use(logger());
  app.use("*", clerkMiddleware());
  app.use(
    "*",
    cors({
      origin: "*",
      allowMethods: ["POST", "GET", "OPTIONS", "DELETE", "PUT"],
    }),
  );
  app.get("/error", () => {
    throw new Error("Error in backend");
  });
  app.notFound((c) => {
    return c.json({ message: "Not Found" }, 404);
  });
  app.onError((err, c) => {
    return c.json({ message: err.message }, 500);
  });
  return app;
}
