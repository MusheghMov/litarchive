import { OpenAPIHono } from "@hono/zod-openapi";

type Bindings = {
  DATABASE_URL: string;
  DATABASE_AUTH_TOKEN: string;
};

const app = new OpenAPIHono<{ Bindings: Bindings }, { "/": any }>();
export default app;
