import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { connectToDB } from "@repo/db";

type Bindings = {
  DATABASE_URL: string;
  DATABASE_AUTH_TOKEN: string;
};

const app = new Hono<{ Bindings: Bindings }>();

const articlesApp = app
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
      const res = await db.query.articles.findMany({
        where: (articles, { like }) => like(articles.title, `%${search}%`),
      });

      return c.json(res);
    },
  )
  .get(
    "/:slug",
    zValidator(
      "param",
      z.object({
        slug: z.string(),
      }),
    ),
    async (c) => {
      const slug = c.req.param("slug");
      const db = connectToDB({
        url: c.env.DATABASE_URL,
        authoToken: c.env.DATABASE_AUTH_TOKEN,
      });
      const res = await db.query.articles.findMany({
        limit: 1,
        where: (articles, { eq }) => eq(articles.slug, slug),
      });
      return c.json(res[0]);
    },
  );

export default articlesApp;
