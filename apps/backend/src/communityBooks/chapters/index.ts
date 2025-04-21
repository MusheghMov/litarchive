import { connectToDB, sql, eq } from "@repo/db";
import { createRouter } from "../../lib/create-app";
import { createRoute, z } from "@hono/zod-openapi";
import { zValidator } from "@hono/zod-validator";
import { user, userBookChapters, userBooks } from "@repo/db/schema";

const router = createRouter();

const communityBooksChaptersRouter = router
  .openapi(
    createRoute({
      method: "get",
      path: "/",
      request: {
        query: z.object({
          bookId: z.string(),
        }),
      },
      responses: {
        200: {
          content: {
            "application/json": {
              schema: z.array(
                z.object({
                  id: z.number(),
                  title: z.string(),
                  number: z.number(),
                  content: z.string(),
                }),
              ),
            },
          },
          description: "Retrieve community book by slug",
        },
        500: {
          content: {
            "application/json": {
              schema: z.object({
                error: z.string(),
              }),
            },
          },
          description: "Internal server error",
        },
      },
    }),
    async (c) => {
      try {
        const { bookId } = c.req.valid("query");

        const db = connectToDB({
          url: c.env.DATABASE_URL,
          authoToken: c.env.DATABASE_AUTH_TOKEN,
        });

        const res = await db.query.userBookChapters.findMany({
          where: (userBookChapters, { eq }) =>
            eq(userBookChapters.userBookId, +bookId),
          columns: {
            id: true,
            title: true,
            number: true,
            content: true,
          },
        });

        return c.json(res, 200);
      } catch (error) {
        console.error("Error fetching community book chapters:", error);
        return c.json({ error: "Error fetching community book chapters" }, 500);
      }
    },
  )
  .openapi(
    createRoute({
      method: "get",
      path: "/:chapterId",
      request: {
        params: z.object({
          chapterId: z.string(),
        }),
      },
      responses: {
        200: {
          content: {
            "application/json": {
              schema: z.object({
                id: z.number(),
                title: z.string(),
                number: z.number(),
                content: z.string(),
                isUserEditor: z.boolean(),
              }),
            },
          },
          description: "Retrieve community book by slug",
        },
        500: {
          content: {
            "application/json": {
              schema: z.object({
                error: z.string(),
              }),
            },
          },
          description: "Internal server error",
        },
        404: {
          content: {
            "application/json": {
              schema: z.object({
                error: z.string(),
              }),
            },
          },
          description: "Not found",
        },
        401: {
          content: {
            "application/json": {
              schema: z.object({
                error: z.string(),
              }),
            },
          },
          description: "Unauthorized",
        },
      },
    }),
    async (c) => {
      const userId = c.req.header("Authorization");
      if (!userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      try {
        const { chapterId } = c.req.valid("param");

        const db = connectToDB({
          url: c.env.DATABASE_URL,
          authoToken: c.env.DATABASE_AUTH_TOKEN,
        });

        const res = await db.query.userBookChapters.findFirst({
          where: (userBookChapters, { eq }) =>
            eq(userBookChapters.id, +chapterId),
          columns: {
            id: true,
            title: true,
            number: true,
            content: true,
          },
          extras: {
            isUserEditor: sql<boolean>`(
      SELECT CASE 
        WHEN (
          SELECT u.sub 
          FROM ${user} u
          JOIN ${userBooks} ub ON ub.user_id = u.id
          WHERE ub.id = ${userBookChapters}.user_book_id
        ) = ${userId} THEN TRUE
        ELSE FALSE
      END
    )`.as("isUserEditor"),
          },
        });
        console.log("res chapters: ", res);

        if (!res) {
          return c.json({ error: "Chapter not found" }, 404);
        }

        return c.json(res, 200);
      } catch (error) {
        console.error("Error fetching community book chapters:", error);
        return c.json({ error: "Error fetching community book chapters" }, 500);
      }
    },
  )
  .post(
    "/:bookId",
    zValidator(
      "form",
      z.object({
        title: z.string().optional(),
        content: z.string().optional(),
      }),
    ),
    async (c) => {
      const userId = c.req.header("Authorization");
      if (!userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const db = connectToDB({
        url: c.env.DATABASE_URL,
        authoToken: c.env.DATABASE_AUTH_TOKEN,
      });

      const dbUser = await db.query.user.findFirst({
        where: (users, { eq }) => eq(users.sub, userId),
      });

      if (!dbUser) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const params = c.req.param();
      const bookId = Number.parseInt(params.bookId);

      if (!bookId) {
        return c.json({ error: "Book id is required" }, 400);
      }

      const book = await db.query.userBooks.findFirst({
        where: (userBooks, { eq }) => eq(userBooks.id, bookId),
        with: {
          user: {
            columns: {
              sub: true,
              firstName: true,
              lastName: true,
              email: true,
              imageUrl: true,
            },
          },
          chapters: true,
        },
        extras: {
          chapterCount: sql<number>`count(${userBookChapters.userBookId})`.as(
            "chapterCount",
          ),
        },
      });

      if (userId !== book?.user?.sub) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { title, content } = c.req.valid("form");

      const res = await db
        .insert(userBookChapters)
        .values({
          userBookId: bookId,
          title: title || "",
          content: content || "",
          number: book?.chapters?.length + 1 || 1,
        })
        .returning({
          id: userBookChapters.id,
          number: userBookChapters.number,
        });

      return c.json(res);
    },
  )
  .put(
    "/:chapterId",
    zValidator(
      "form",
      z.object({
        title: z.string().optional(),
        content: z.string().optional(),
      }),
    ),
    async (c) => {
      const userId = c.req.header("Authorization");
      if (!userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const db = connectToDB({
        url: c.env.DATABASE_URL,
        authoToken: c.env.DATABASE_AUTH_TOKEN,
      });

      const dbUser = await db.query.user.findFirst({
        where: (users, { eq }) => eq(users.sub, userId),
      });

      if (!dbUser) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const params = c.req.param();
      const chapterId = Number.parseInt(params.chapterId);

      if (!chapterId) {
        return c.json({ error: "Chapter id is required" }, 400);
      }

      const { title, content } = c.req.valid("form");

      const res = await db
        .update(userBookChapters)
        .set({
          ...(title && { title: title || "" }),
          ...(content && {
            content: content || "",
          }),
        })
        .where(eq(userBookChapters.id, chapterId));

      return c.json(res);
    },
  );

export default communityBooksChaptersRouter;
