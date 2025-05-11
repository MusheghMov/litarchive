import { connectToDB, eq } from "@repo/db";
import { createRouter } from "../../../lib/create-app";
import { createRoute, z } from "@hono/zod-openapi";
import { zValidator } from "@hono/zod-validator";
import { chapterVersions } from "@repo/db/schema";
import { getAuth } from "@hono/clerk-auth";

const router = createRouter();

const chapterVersionsRouter = router
  .openapi(
    createRoute({
      method: "get",
      path: "/",
      request: {
        query: z.object({
          chapterId: z.string(),
        }),
      },
      responses: {
        200: {
          content: {
            "application/json": {
              schema: z.array(
                z.object({
                  content: z.string(),
                  name: z.string(),
                  id: z.number(),
                  isCurrentlyPublished: z.boolean().nullable(),
                  createdAt: z.string().nullable(),
                  versionNumber: z.number(),
                  userBookChapterId: z.number(),
                  lastPublishedAt: z.string().nullable(),
                }),
              ),
            },
          },
          description: "Retrieve chapter versions",
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
        const db = connectToDB({
          url: c.env.DATABASE_URL,
          authoToken: c.env.DATABASE_AUTH_TOKEN,
        });

        const queryParams = c.req.query();
        const chapterId = Number.parseInt(queryParams.chapterId);

        const res = await db.query.chapterVersions.findMany({
          where: (chapterVersion, { eq }) =>
            eq(chapterVersion.userBookChapterId, chapterId),
          columns: {
            id: true,
            name: true,
            content: true,
            versionNumber: true,
            userBookChapterId: true,
            isCurrentlyPublished: true,
            createdAt: true,
            lastPublishedAt: true,
          },
        });

        return c.json(res, 200);
      } catch (error) {
        console.error("Error fetching chapter versions:", error);
        return c.json({ error: "Error fetching chapter versions" }, 500);
      }
    },
  )
  .openapi(
    createRoute({
      method: "get",
      path: "/:chapterVersionId",
      request: {
        params: z.object({
          chapterVersionId: z.string(),
        }),
      },
      responses: {
        200: {
          content: {
            "application/json": {
              schema: z.object({
                id: z.number(),
                name: z.string(),
                content: z.string(),
                isCurrentlyPublished: z.boolean().nullable(),
                createdAt: z.string().nullable(),
              }),
            },
          },
          description: "Retrieve chapter version",
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
        400: {
          content: {
            "application/json": {
              schema: z.object({
                error: z.string(),
              }),
            },
          },
          description: "Bad request",
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
      const auth = getAuth(c);
      const userId = auth?.userId;
      if (!userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      const params = c.req.param();
      const chapterVersionId = Number.parseInt(params.chapterVersionId);
      if (!chapterVersionId) {
        return c.json({ error: "Chapter version id is required" }, 400);
      }

      try {
        const db = connectToDB({
          url: c.env.DATABASE_URL,
          authoToken: c.env.DATABASE_AUTH_TOKEN,
        });

        const res = await db.query.chapterVersions.findFirst({
          where: (chapterVersion, { eq }) =>
            eq(chapterVersion.id, chapterVersionId),
          columns: {
            id: true,
            name: true,
            content: true,
            isCurrentlyPublished: true,
            createdAt: true,
          },
        });

        if (!res) {
          return c.json({ error: "Chapter version not found" }, 404);
        }

        return c.json(res, 200);
      } catch (error) {
        console.error("Error fetching chapter version:", error);
        return c.json({ error: "Error fetching chapter version" }, 500);
      }
    },
  )
  .post(
    "/:chapterId",
    zValidator(
      "form",
      z.object({
        name: z.string().optional(),
        content: z.string().optional(),
      }),
    ),
    async (c) => {
      const auth = getAuth(c);
      const userId = auth?.userId;
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

      const chapter = await db.query.userBookChapters.findFirst({
        where: (userBookChapters, { eq }) => eq(userBookChapters.id, chapterId),
        with: {
          userBook: {
            with: {
              user: {
                columns: {
                  sub: true,
                },
              },
            },
          },
          versions: true,
        },
      });

      if (!chapter) {
        return c.json({ error: "Chapter not found" }, 404);
      }

      if (userId !== chapter.userBook?.user?.sub) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { name, content } = c.req.valid("form");

      try {
        const res = await db
          .insert(chapterVersions)
          .values({
            name: name || "",
            content: content || "",
            versionNumber: chapter?.versions?.length + 1 || 1,
            userBookChapterId: chapterId,
          })
          .returning({
            id: chapterVersions.id,
            versionNumber: chapterVersions.versionNumber,
          });

        return c.json(res[0]);
      } catch (error) {
        console.error("Error saving chapter:", error);
        return c.json({ error: "Error saving chapter" }, 500);
      }
    },
  )
  .put(
    "/:chapterVersionId",
    zValidator(
      "query",
      z.object({
        chapterId: z.string(),
      }),
    ),
    async (c) => {
      const auth = getAuth(c);
      const userId = auth?.userId;
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
      const chapterVersionId = Number.parseInt(params.chapterVersionId);

      if (!chapterVersionId) {
        return c.json({ error: "Chapter id is required" }, 400);
      }
      const queryParams = c.req.query();
      const chapterId = Number.parseInt(queryParams.chapterId);
      if (!chapterId) {
        return c.json({ error: "Chapter id is required" }, 400);
      }

      // get published chapter for this chapter
      const publishedChapter = await db.query.chapterVersions.findFirst({
        where: (chapterVersion, { eq, and }) =>
          and(
            eq(chapterVersion.userBookChapterId, chapterId),
            eq(chapterVersion.isCurrentlyPublished, true),
          ),
        columns: {
          id: true,
        },
      });

      if (publishedChapter) {
        try {
          await db
            .update(chapterVersions)
            .set({
              isCurrentlyPublished: false,
            })
            .where(eq(chapterVersions.id, publishedChapter.id));
        } catch (error) {
          console.error("Error publishing chapter:", error);
          return c.json({ error: "Error publishing chapter" }, 500);
        }
      }

      try {
        const res = await db
          .update(chapterVersions)
          .set({
            isCurrentlyPublished: true,
          })
          .where(eq(chapterVersions.id, chapterVersionId))
          .returning({
            id: chapterVersions.id,
          });

        return c.json(res[0]);
      } catch (error) {
        console.error("Error publishing chapter:", error);
        return c.json({ error: "Error publishing chapter" }, 500);
      }
    },
  );

export default chapterVersionsRouter;
