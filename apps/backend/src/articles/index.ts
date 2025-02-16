import { connectToDB } from "@repo/db";
import { z, createRoute } from "@hono/zod-openapi";
import { createRouter } from "../lib/create-app";

const router = createRouter();

const articlesRoute = router
  .openapi(
    createRoute({
      method: "get",
      path: "/",
      request: {
        params: z.object({
          search: z.string().optional(),
        }),
      },
      responses: {
        200: {
          content: {
            "application/json": {
              schema: z.array(
                z.object({
                  tags: z.string().nullable(),
                  description: z.string().nullable(),
                  title: z.string(),
                  status: z.string().nullable(),
                  content: z.string(),
                  id: z.number(),
                  imageUrl: z.string().nullable(),
                  // userId: z.number(),
                  createdAt: z.string().nullable(),
                  updatedAt: z.string().nullable(),
                  slug: z.string().nullable(),
                }),
              ),
            },
          },
          description: "Retrive articles",
        },
      },
    }),
    async (c) => {
      const search = c.req.query("search") || "";
      const userId = c.req.header("Authorization");
      const isAuthenticated = !!userId;
      const db = connectToDB({
        url: c.env.DATABASE_URL,
        authoToken: c.env.DATABASE_AUTH_TOKEN,
      });
      const res = await db.query.articles.findMany({
        where: (articles, { like }) => like(articles.title, `%${search}%`),
      });
      const articlesWithoutUserId = res.map(({ userId, ...rest }) => rest);
      if (isAuthenticated) {
        return c.json(res);
      }
      return c.json(articlesWithoutUserId);
    },
  )
  .openapi(
    createRoute({
      method: "get",
      path: "/:slug",
      request: {
        params: z.object({
          slug: z.string(),
        }),
      },
      responses: {
        200: {
          content: {
            "application/json": {
              schema: z.object({
                tags: z.string().nullable(),
                description: z.string().nullable(),
                title: z.string(),
                status: z.string().nullable(),
                content: z.string(),
                id: z.number(),
                imageUrl: z.string().nullable(),
                // userId: z.number(),
                createdAt: z.string().nullable(),
                updatedAt: z.string().nullable(),
                slug: z.string().nullable(),
              }),
            },
          },
          description: "Retrive article",
        },
      },
    }),
    async (c) => {
      const slug = c.req.param("slug");
      const userId = c.req.header("Authorization");
      const isAuthenticated = !!userId;
      const db = connectToDB({
        url: c.env.DATABASE_URL,
        authoToken: c.env.DATABASE_AUTH_TOKEN,
      });
      const res = await db.query.articles.findMany({
        limit: 1,
        where: (articles, { eq }) => eq(articles.slug, slug),
      });
      const articlesWithoutUserId = res.map(({ userId, ...rest }) => rest);
      if (isAuthenticated) {
        return c.json(res[0]);
      }
      return c.json(articlesWithoutUserId[0]);
    },
  );

export default articlesRoute;
