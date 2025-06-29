import { connectToDB, sql, eq, and, gt } from "@repo/db";
import { createRouter } from "../../lib/create-app";
import { createRoute, z } from "@hono/zod-openapi";
import { zValidator } from "@hono/zod-validator";
import { userBookChapters } from "@repo/db/schema";
import chapterVersionsRouter from "./versions";
import { getAuth } from "@hono/clerk-auth";

const router = createRouter();

const communityBooksChaptersRouter = router
  .route("/versions", chapterVersionsRouter)
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
                  audioUrl: z.string().nullable(),
                  audioStatus: z.string().nullable(),
                  audioGeneratedAt: z.string().nullable(),
                }),
              ),
            },
          },
          description: "Retrieve community book by slug",
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
        const auth = getAuth(c);
        const userId = auth?.userId;

        const { bookId } = c.req.valid("query");
        if (!bookId) {
          return c.json({ error: "Book id is required" }, 400);
        }

        const db = connectToDB({
          url: c.env.DATABASE_URL,
          authoToken: c.env.DATABASE_AUTH_TOKEN,
        });

        let dbUser: any;
        let isUserAuthor = false;
        let isUserCollaborator = false;

        if (userId && userId !== "null" && userId !== "undefined") {
          dbUser = await db.query.user.findFirst({
            where: (users, { eq }) => eq(users.sub, userId),
          });

          isUserAuthor = await db.query.userBooks
            .findFirst({
              where: (userBooks, { eq }) =>
                eq(userBooks.id, Number.parseInt(bookId.toString())),
            })
            .then((res) => res?.userId === dbUser?.id);

          isUserCollaborator = await db.query.userBookCollaborators
            .findFirst({
              where: (userBookCollaborators, { eq, and }) =>
                and(
                  // eq(userBookCollaborators.userBookId, bookId!),
                  eq(userBookCollaborators.userId, dbUser?.id),
                  eq(userBookCollaborators.userId, dbUser?.id),
                ),
            })
            .then((res) => res?.userId === dbUser?.id);
        }

        try {
          const res = await db.query.userBookChapters.findMany({
            where: (userBookChapters, { eq }) =>
              eq(userBookChapters.userBookId, +bookId),
            columns: {
              id: true,
              title: true,
              number: true,
              content: true,
              audioUrl: true,
              audioStatus: true,
              audioGeneratedAt: true,
            },
            with: {
              versions: {
                ...(!(isUserAuthor || isUserCollaborator) && {
                  where: (chapterVersions, { eq }) =>
                    eq(chapterVersions.isCurrentlyPublished, true),
                }),
              },
            },
          });

          if (isUserAuthor || isUserCollaborator) {
            return c.json(res, 200);
          } else {
            // return only books that has published chapters
            return c.json(
              res.filter((chapter) => chapter.versions.length > 0),
              200,
            );
          }
        } catch (error: any) {
          console.error("Error fetching community book chapters:", error);
          return c.json(
            { error: "Error fetching community book chapters" },
            500,
          );
        }
      } catch (error) {
        console.error("Error fetching community book chapters:", error);
        return c.json({ error: "Error fetching community book chapters" }, 500);
      }
    },
  )
  // chapters by bookSlug
  .openapi(
    createRoute({
      method: "get",
      path: "/by-slug/:bookSlug",
      request: {
        params: z.object({
          bookSlug: z.string(),
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
                  audioUrl: z.string().nullable(),
                  audioStatus: z.string().nullable(),
                  audioGeneratedAt: z.string().nullable(),
                  userBook: z.object({
                    title: z.string(),
                    slug: z.string().nullable(),
                  }),
                }),
              ),
            },
          },
          description: "Retrieve community book by slug",
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
        const auth = getAuth(c);
        const userId = auth?.userId;

        const { bookSlug } = c.req.valid("param");
        if (!bookSlug) {
          return c.json({ error: "Book id is required" }, 400);
        }

        const db = connectToDB({
          url: c.env.DATABASE_URL,
          authoToken: c.env.DATABASE_AUTH_TOKEN,
        });

        const book = await db.query.userBooks.findFirst({
          where: (userBooks, { eq }) => eq(userBooks.slug, bookSlug),
          columns: {
            id: true,
          },
        });
        if (!book) {
          return c.json({ error: "Book not found" }, 404);
        }
        const bookId = book.id;

        let dbUser: any;
        let isUserAuthor = false;
        let isUserCollaborator = false;

        if (userId && userId !== "null" && userId !== "undefined") {
          dbUser = await db.query.user.findFirst({
            where: (users, { eq }) => eq(users.sub, userId),
          });

          isUserAuthor = await db.query.userBooks
            .findFirst({
              where: (userBooks, { eq }) =>
                eq(userBooks.id, Number.parseInt(bookId.toString())),
            })
            .then((res) => res?.userId === dbUser?.id);

          isUserCollaborator = await db.query.userBookCollaborators
            .findFirst({
              where: (userBookCollaborators, { eq, and }) =>
                and(
                  // eq(userBookCollaborators.userBookId, bookId!),
                  eq(userBookCollaborators.userId, dbUser?.id),
                  eq(userBookCollaborators.userId, dbUser?.id),
                ),
            })
            .then((res) => res?.userId === dbUser?.id);
        }

        try {
          const res = await db.query.userBookChapters.findMany({
            where: (userBookChapters, { eq }) =>
              eq(userBookChapters.userBookId, +bookId),
            columns: {
              id: true,
              title: true,
              number: true,
              content: true,
              audioUrl: true,
              audioStatus: true,
              audioGeneratedAt: true,
            },
            with: {
              userBook: {
                columns: {
                  title: true,
                  slug: true,
                },
              },
              versions: {
                ...(!(isUserAuthor || isUserCollaborator) && {
                  where: (chapterVersions, { eq }) =>
                    eq(chapterVersions.isCurrentlyPublished, true),
                }),
              },
            },
          });

          if (isUserAuthor || isUserCollaborator) {
            return c.json(res, 200);
          } else {
            // return only books that has published chapters
            return c.json(
              res.filter((chapter) => chapter.versions.length > 0),
              200,
            );
          }
        } catch (error: any) {
          console.error("Error fetching community book chapters:", error);
          return c.json(
            { error: "Error fetching community book chapters" },
            500,
          );
        }
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
                title: z.string().nullish(),
                content: z.string().nullish(),
                number: z.number(),
                audioUrl: z.string().nullable(),
                audioStatus: z.string().nullable(),
                audioGeneratedAt: z.string().nullable(),
                isUserAuthor: z.boolean(),
                isUserEditor: z.boolean(),
                isUserViewer: z.boolean(),
                userBook: z.object({
                  title: z.string(),
                  slug: z.string().nullable(),
                }),
                versions: z.array(
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
      try {
        const auth = getAuth(c);
        const userId = auth?.userId;

        const { chapterId } = c.req.valid("param");

        const db = connectToDB({
          url: c.env.DATABASE_URL,
          authoToken: c.env.DATABASE_AUTH_TOKEN,
        });

        let dbUser: any;
        let isUserAuthor = false;
        let isUserEditor = false;
        let isUserViewer = false;

        if (userId && userId !== "null" && userId !== "undefined") {
          dbUser = await db.query.user.findFirst({
            where: (users, { eq }) => eq(users.sub, userId),
          });

          if (!dbUser) {
            return c.json({ error: "Unauthorized" }, 401);
          }

          const userBookChapter = await db.query.userBookChapters.findFirst({
            where: (userBookChapters, { eq }) =>
              eq(userBookChapters.id, +chapterId),
            with: {
              userBook: {
                columns: {
                  id: true,
                  userId: true,
                },
                with: {
                  collaborators: {
                    columns: {
                      id: true,
                      role: true,
                    },
                    with: {
                      user: {
                        columns: {
                          firstName: true,
                          lastName: true,
                          email: true,
                          imageUrl: true,
                          sub: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          });

          if (!userBookChapter) {
            return c.json({ error: "Chapter not found" }, 404);
          }

          isUserAuthor = userBookChapter?.userBook?.userId === dbUser.id;
          isUserEditor = userBookChapter?.userBook?.collaborators?.some(
            (collaborator) =>
              collaborator.user.sub === userId &&
              collaborator.role === "editor",
          );
          isUserViewer = userBookChapter?.userBook?.collaborators?.some(
            (collaborator) =>
              collaborator.user.sub === userId &&
              collaborator.role === "viewer",
          );
        }

        const res = await db.query.userBookChapters.findFirst({
          where: (userBookChapters, { eq }) =>
            eq(userBookChapters.id, +chapterId),
          columns: {
            id: true,
            title: true,
            // ...((isUserAuthor || isUserEditor || isUserViewer) && {
            //   title: true,
            // }),
            number: true,
            audioUrl: true,
            audioStatus: true,
            audioGeneratedAt: true,
            ...((isUserAuthor || isUserEditor || isUserViewer) && {
              content: true,
            }),
          },
          with: {
            userBook: {
              columns: {
                title: true,
                slug: true,
              },
            },
            versions: {
              ...(!(isUserAuthor || isUserEditor || isUserViewer) && {
                where: (chapterVersions, { eq }) =>
                  eq(chapterVersions.isCurrentlyPublished, true),
              }),
            },
          },
        });
        if (!res) {
          return c.json({ error: "Chapter not found" }, 404);
        }
        const finalRes = {
          ...res!,
          isUserAuthor: isUserAuthor,
          isUserEditor: isUserEditor,
          isUserViewer: isUserViewer,
        };

        return c.json(finalRes, 200);
      } catch (error) {
        console.error("Error fetching community book chapters:", error);
        return c.json({ error: "Error fetching community book chapters" }, 500);
      }
    },
  )
  .openapi(
    createRoute({
      method: "get",
      path: "/navigation/by-book/:bookSlug/:chapterNumber",
      request: {
        params: z.object({
          bookSlug: z.string(),
          chapterNumber: z.string(),
        }),
      },
      responses: {
        200: {
          content: {
            "application/json": {
              schema: z.object({
                previous: z
                  .object({
                    id: z.number(),
                    number: z.number(),
                    title: z.string().nullable(),
                  })
                  .nullable(),
                next: z
                  .object({
                    id: z.number(),
                    number: z.number(),
                    title: z.string().nullable(),
                  })
                  .nullable(),
              }),
            },
          },
          description:
            "Get previous and next chapter navigation data by book slug and chapter number",
        },
        404: {
          content: {
            "application/json": {
              schema: z.object({
                error: z.string(),
              }),
            },
          },
          description: "Book or chapter not found",
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
        const { bookSlug, chapterNumber } = c.req.valid("param");

        const db = connectToDB({
          url: c.env.DATABASE_URL,
          authoToken: c.env.DATABASE_AUTH_TOKEN,
        });

        const book = await db.query.userBooks.findFirst({
          where: (userBooks, { eq }) => eq(userBooks.slug, bookSlug),
          columns: {
            id: true,
          },
        });

        if (!book) {
          return c.json({ error: "Book not found" }, 404);
        }

        const currentChapterNumber = parseInt(chapterNumber, 10);
        if (isNaN(currentChapterNumber)) {
          return c.json({ error: "Invalid chapter number" }, 404);
        }

        const [previousChapter, nextChapter] = await Promise.all([
          db.query.userBookChapters.findFirst({
            where: (userBookChapters, { eq, and, lt }) =>
              and(
                eq(userBookChapters.userBookId, book.id),
                lt(userBookChapters.number, currentChapterNumber),
              ),
            columns: {
              id: true,
              number: true,
              title: true,
            },
            orderBy: (userBookChapters, { desc }) => [
              desc(userBookChapters.number),
            ],
          }),
          db.query.userBookChapters.findFirst({
            where: (userBookChapters, { eq, and, gt }) =>
              and(
                eq(userBookChapters.userBookId, book.id),
                gt(userBookChapters.number, currentChapterNumber),
              ),
            columns: {
              id: true,
              number: true,
              title: true,
            },
            orderBy: (userBookChapters, { asc }) => [
              asc(userBookChapters.number),
            ],
          }),
        ]);

        return c.json(
          {
            previous: previousChapter || null,
            next: nextChapter || null,
          },
          200,
        );
      } catch (error) {
        console.error("Error fetching chapter navigation:", error);
        return c.json({ error: "Error fetching chapter navigation" }, 500);
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
          collaborators: {
            columns: {
              id: true,
              role: true,
            },
            with: {
              user: {
                columns: {
                  firstName: true,
                  lastName: true,
                  email: true,
                  imageUrl: true,
                  sub: true,
                },
              },
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
      if (!book) {
        return c.json({ error: "Book not found" }, 404);
      }
      const isUserAuthor = book?.user?.sub === userId;
      const isUserCollaborator = book?.collaborators?.some(
        (collaborator) =>
          collaborator.user.sub === userId && collaborator.role === "editor",
      );

      if (!isUserAuthor && !isUserCollaborator) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { title, content } = c.req.valid("form");

      const chapterNumber = book?.chapters?.length + 1 || 1;
      const res = await db
        .insert(userBookChapters)
        .values({
          userBookId: bookId,
          title: title || `Chapter ${chapterNumber}`,
          content: content || "",
          number: chapterNumber,
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
  )
  .delete("/:chapterId", async (c) => {
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

    const userBookChapter = await db.query.userBookChapters.findFirst({
      where: (userBookChapters, { eq }) => eq(userBookChapters.id, chapterId),
      columns: {
        userBookId: true,
        number: true,
      },
      with: {
        userBook: {
          columns: {
            userId: true,
          },
        },
      },
    });
    if (!userBookChapter) {
      return c.json({ error: "Chapter not found" }, 404);
    }

    const isUserAuthor = userBookChapter?.userBook?.userId === dbUser.id;
    const bookId = userBookChapter?.userBookId;
    const chapterNumber = userBookChapter?.number;

    if (!isUserAuthor) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    await db.transaction(async (tx) => {
      await tx
        .delete(userBookChapters)
        .where(eq(userBookChapters.id, chapterId));
      await tx
        .update(userBookChapters)

        .set({
          number: sql<number>`(${userBookChapters.number} - 1)`,
        })
        .where(
          and(
            eq(userBookChapters.userBookId, bookId),
            gt(userBookChapters.number, chapterNumber),
          ),
        );
    });

    const res = await db
      .delete(userBookChapters)
      .where(eq(userBookChapters.id, chapterId));
    return c.json(res);
  });

const audioGenerationRouter = createRouter()
  .openapi(
    createRoute({
      method: "post",
      path: "/:chapterId/generate-audio",
      request: {
        params: z.object({
          chapterId: z.string(),
        }),
        body: {
          content: {
            "application/json": {
              schema: z.object({
                language: z.string().optional().default("en"),
              }),
            },
          },
        },
      },
      responses: {
        200: {
          content: {
            "application/json": {
              schema: z.object({
                workflowId: z.string(),
                status: z.string(),
                message: z.string(),
              }),
            },
          },
          description: "Audio generation workflow started successfully",
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
        404: {
          content: {
            "application/json": {
              schema: z.object({
                error: z.string(),
              }),
            },
          },
          description: "Chapter not found",
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
        const auth = getAuth(c);
        const userId = auth?.userId;
        if (!userId) {
          return c.json({ error: "Unauthorized" }, 401);
        }

        const { chapterId } = c.req.valid("param");
        const { language } = await c.req.json();

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

        // Get chapter and verify permissions
        const chapter = await db.query.userBookChapters.findFirst({
          where: (userBookChapters, { eq }) =>
            eq(userBookChapters.id, +chapterId),
          with: {
            userBook: {
              columns: {
                id: true,
                userId: true,
              },
              with: {
                collaborators: {
                  columns: {
                    role: true,
                  },
                  with: {
                    user: {
                      columns: {
                        sub: true,
                      },
                    },
                  },
                },
              },
            },
          },
        });

        if (!chapter) {
          return c.json({ error: "Chapter not found" }, 404);
        }

        const isUserAuthor = chapter.userBook?.userId === dbUser.id;
        const isUserEditor = chapter.userBook?.collaborators?.some(
          (collaborator) =>
            collaborator.user.sub === userId && collaborator.role === "editor",
        );

        if (!isUserAuthor && !isUserEditor) {
          return c.json({ error: "Unauthorized" }, 401);
        }

        try {
          const workflowInstance = await c.env.AUDIO_GENERATION_WORKFLOW.create(
            {
              params: {
                chapterId: +chapterId,
                content: chapter.content,
                language: language || "en",
                databaseUrl: c.env.DATABASE_URL,
                databaseAuthToken: c.env.DATABASE_AUTH_TOKEN,
                imageStorageUrl: c.env.IMAGE_STORAGE_URL,
              },
            },
          );

          // Update chapter status to pending
          await db
            .update(userBookChapters)
            .set({
              audioStatus: "pending",
            })
            .where(eq(userBookChapters.id, +chapterId));

          return c.json(
            {
              workflowId: workflowInstance.id.toString(),
              status: "pending",
              message: "Audio generation started",
            },
            200,
          );
        } catch (error) {
          console.error("Error starting audio generation workflow:", error);

          // Mark as failed
          await db
            .update(userBookChapters)
            .set({
              audioStatus: "failed",
            })
            .where(eq(userBookChapters.id, +chapterId));

          return c.json({ error: "Failed to start audio generation" }, 500);
        }
      } catch (error) {
        console.error("Error in audio generation endpoint:", error);
        return c.json({ error: "Internal server error" }, 500);
      }
    },
  )
  .openapi(
    createRoute({
      method: "get",
      path: "/:chapterId/audio-status",
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
                chapterId: z.number(),
                audioStatus: z.string().nullable(),
                audioUrl: z.string().nullable(),
                audioGeneratedAt: z.string().nullable(),
              }),
            },
          },
          description: "Audio generation status retrieved successfully",
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
        404: {
          content: {
            "application/json": {
              schema: z.object({
                error: z.string(),
              }),
            },
          },
          description: "Chapter not found",
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
        const auth = getAuth(c);
        const userId = auth?.userId;
        if (!userId) {
          return c.json({ error: "Unauthorized" }, 401);
        }

        const { chapterId } = c.req.valid("param");

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

        // Get chapter and verify permissions
        const chapter = await db.query.userBookChapters.findFirst({
          where: (userBookChapters, { eq }) =>
            eq(userBookChapters.id, +chapterId),
          columns: {
            id: true,
            audioStatus: true,
            audioUrl: true,
            audioGeneratedAt: true,
          },
          with: {
            userBook: {
              columns: {
                id: true,
                userId: true,
              },
              with: {
                collaborators: {
                  columns: {
                    role: true,
                  },
                  with: {
                    user: {
                      columns: {
                        sub: true,
                      },
                    },
                  },
                },
              },
            },
          },
        });

        if (!chapter) {
          return c.json({ error: "Chapter not found" }, 404);
        }

        const isUserAuthor = chapter.userBook?.userId === dbUser.id;
        const isUserEditor = chapter.userBook?.collaborators?.some(
          (collaborator) =>
            collaborator.user.sub === userId && collaborator.role === "editor",
        );

        if (!isUserAuthor && !isUserEditor) {
          return c.json({ error: "Unauthorized" }, 401);
        }

        return c.json(
          {
            chapterId: chapter.id,
            audioStatus: chapter.audioStatus,
            audioUrl: chapter.audioUrl,
            audioGeneratedAt: chapter.audioGeneratedAt,
          },
          200,
        );
      } catch (error) {
        console.error("Error fetching audio status:", error);
        return c.json({ error: "Internal server error" }, 500);
      }
    },
  );

export default communityBooksChaptersRouter.route("/", audioGenerationRouter);
