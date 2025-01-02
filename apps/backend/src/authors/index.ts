import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { connectToDB } from "@repo/db";

type Bindings = {
  DATABASE_URL: string;
  DATABASE_AUTH_TOKEN: string;
};

const app = new Hono<{ Bindings: Bindings }>();

const authorsApp = app
  .get(
    "/",
    zValidator(
      "query",
      z
        .object({
          search: z.string().optional(),
        })
        .optional(),
    ),
    async (c) => {
      const search = c.req.query("search") || "";
      const db = connectToDB({
        url: c.env.DATABASE_URL,
        authoToken: c.env.DATABASE_AUTH_TOKEN,
      });
      const res = await db.query.authors.findMany({
        where: (authors, { like }) => like(authors.name, `%${search}%`),
      });

      return c.json(res);
    },
  )
  .get(
    "/:authorId",
    zValidator(
      "param",
      z.object({
        authorId: z.string(),
      }),
    ),
    async (c) => {
      const authorId = +c.req.param("authorId");
      const db = connectToDB({
        url: c.env.DATABASE_URL,
        authoToken: c.env.DATABASE_AUTH_TOKEN,
      });
      const res = await db.query.authors.findMany({
        limit: 1,
        where: (auhtors, { eq, and }) => and(eq(auhtors.id, authorId)),
      });
      return c.json(res[0]);
    },
  );

export default authorsApp;
