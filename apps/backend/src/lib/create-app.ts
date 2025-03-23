import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

type Bindings = {
  DATABASE_URL: string;
  DATABASE_AUTH_TOKEN: string;
};

export function createRouter() {
  return new OpenAPIHono<{ Bindings: Bindings }>({
    strict: false,
  });
}

export default function createApp() {
  const app = createRouter();
  app.use(logger());
  app.use(
    "*",
    cors({
      origin: "*",
      allowMethods: ["POST", "GET", "OPTIONS", "DELETE", "PUT"],
    }),
  );
  app.get("/error", () => {
    throw new Error("Errorrrrrrrrrr!!!!!!");
  });
  app.notFound((c) => {
    return c.json({ message: "Not Found" }, 404);
  });
  app.onError((err, c) => {
    return c.json({ message: err.message }, 500);
  });
  return app;
}
