import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { YDurableObjects } from "y-durableobjects";
import { clerkMiddleware } from "@hono/clerk-auth";
import { AudioGenerationParams } from "../workflows/audio-generation";
import { ImageGenerationParams } from "../workflows/image-generation";

export type Bindings = {
  DATABASE_URL: string;
  DATABASE_AUTH_TOKEN: string;
  IMAGE_STORAGE_URL: string;
  litarchive: R2Bucket;
  AI: Ai;
  Y_DURABLE_OBJECTS: DurableObjectNamespace<YDurableObjects<Env>>;
  AUDIO_GENERATION_WORKFLOW: Workflow<AudioGenerationParams>;
  IMAGE_GENERATION_WORKFLOW: Workflow<ImageGenerationParams>;
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
