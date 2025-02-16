import { connectToDB } from "@repo/db";
import { z, createRoute } from "@hono/zod-openapi";
import { createRouter } from "../lib/create-app";

const router = createRouter();

const authorsRoute = router
  .openapi(
    createRoute({
      method: "get",
      path: "/",
      request: {
        query: z.object({
          search: z.string().optional(),
        }),
      },
      responses: {
        200: {
          content: {
            "application/json": {
              schema: z.array(
                z.object({
                  name: z.string().nullable(),
                  id: z.number(),
                  imageUrl: z.string().nullable(),
                  color: z.string().nullable(),
                  bio: z.string().nullable(),
                  birthDate: z.string().nullable(),
                  deathDate: z.string().nullable(),
                }),
              ),
            },
          },
          description: "Retrive authors",
        },
      },
    }),
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
  .openapi(
    createRoute({
      method: "get",
      path: "/:authorId",
      request: {
        params: z.object({
          authorId: z.string(),
        }),
      },
      responses: {
        200: {
          content: {
            "application/json": {
              schema: z.object({
                name: z.string().nullable(),
                id: z.number(),
                imageUrl: z.string().nullable(),
                color: z.string().nullable(),
                bio: z.string().nullable(),
                birthDate: z.string().nullable(),
                deathDate: z.string().nullable(),
              }),
            },
          },
          description: "Retrive author",
        },
      },
    }),
    async (c) => {
      const authorId = +c.req.param("authorId");
      const db = connectToDB({
        url: c.env.DATABASE_URL,
        authoToken: c.env.DATABASE_AUTH_TOKEN,
      });
      const res = await db.query.authors.findFirst({
        where: (auhtors, { eq, and }) => and(eq(auhtors.id, authorId)),
      });
      return c.json(res);
    },
  );

export default authorsRoute;
