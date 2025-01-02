import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { connectToDB } from "@repo/db";
import { user } from "@repo/db/schema";

type Bindings = {
  DATABASE_URL: string;
  DATABASE_AUTH_TOKEN: string;
};

const app = new Hono<{ Bindings: Bindings }>();

const userApp = app.post(
  "/create",
  zValidator(
    "query",
    z.object({
      sub: z.string(),
    }),
  ),
  async (c) => {
    const sub = c.req.query("sub");

    const db = connectToDB({
      url: c.env.DATABASE_URL,
      authoToken: c.env.DATABASE_AUTH_TOKEN,
    });
    const res = await db.insert(user).values({
      sub: sub,
    });
    return c.json(res);
  },
);

export default userApp;
