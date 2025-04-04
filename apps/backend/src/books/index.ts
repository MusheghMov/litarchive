import { connectToDB, sql, eq, and } from "@repo/db";
import { z } from "zod";
import { books, userLikedBooks, userReadingProgress } from "@repo/db/schema";
import { createRouter } from "../lib/create-app";
import { createRoute } from "@hono/zod-openapi";
import { zValidator } from "@hono/zod-validator";
import { cache } from "hono/cache";

const router = createRouter();

router.use(
  cache({
    cacheName: "books",
    cacheControl: "max-age=3600",
  }),
);

const booksRoute = router
  .openapi(
    createRoute({
      method: "get",
      path: "/",
      request: {
        query: z.object({
          search: z.string().optional(),
          authorId: z.string().optional(),
          chunkSize: z.string().optional(),
          limit: z.string().optional(),
          offset: z.string().optional(),
          isFavorites: z.boolean().optional(),
        }),
      },
      responses: {
        200: {
          content: {
            "application/json": {
              schema: z.array(
                z.object({
                  // description: z.string().nullable(),
                  title: z.string().nullable(),
                  authorId: z.number().nullable(),
                  id: z.number(),
                  titleTranslit: z.string().nullable(),
                  year: z.number().nullable(),
                  textLength: z.number(),
                  bookPagesCount: z.number(),
                  author: z
                    .object({
                      name: z.string().nullable(),
                      id: z.number(),
                    })
                    .nullable(),
                }),
              ),
              // userLikedBooks: ({
              //     ...;
              // } | {
              //     ...;
              // })[];
              // userReadingProgress: ({
              //     ...;
              // } | {
              //     ...;
              // })[]
            },
          },
          description: "Retrive books",
        },
      },
    }),
    async (c) => {
      const userId = c.req.header("Authorization");
      const search = c.req.query("search") || "";
      const authorId = c.req.query("authorId");
      const limit = +c.req.query("limit")!;
      const offset = +c.req.query("offset")!;

      const db = connectToDB({
        url: c.env.DATABASE_URL,
        authoToken: c.env.DATABASE_AUTH_TOKEN,
      });

      let dbUser: any;
      if (userId) {
        try {
          dbUser = await db.query.user.findFirst({
            where: (users, { eq }) => eq(users.sub, userId),
          });
        } catch (e) {
          console.error("error", e);
        }
      }
      const res = await db.query.books.findMany({
        where: (books, { or, and, eq, like }) =>
          authorId
            ? and(
                like(books.title, `%${search}%`),
                like(books.titleTranslit, `%${search}%`),
                like(books.authorName, `%${search}%`),
                eq(books.authorId, +authorId),
              )
            : or(
                like(books.title, `%${search}%`),
                like(books.titleTranslit, `%${search}%`),
                like(books.authorName, `%${search}%`),
              ),
        columns: {
          id: true,
          title: true,
          year: true,
          titleTranslit: true,
          authorId: true,
          description: true,
        },
        with: {
          author: {
            columns: {
              id: true,
              name: true,
            },
          },
          ...(dbUser?.id
            ? {
                userLikedBooks: {
                  where: eq(userLikedBooks.userId, dbUser.id),
                  extras: {
                    isLiked: sql<boolean>`true`.as("isLiked"),
                  },
                },
                userReadingProgress: {
                  where: eq(userReadingProgress.userId, dbUser.id),
                  extras: {
                    lastPageNumber:
                      sql<number>`ceil( ${userReadingProgress.lastCharacterIndex} / ${4000} )`.as(
                        "lastPageNumber",
                      ),
                  },
                },
              }
            : {}),
        },
        extras: {
          textLength: sql<number>`length(${books.text})`.as("textLength"),
          bookPagesCount:
            sql<number>`ceil( length(${books.text}) / ${4000} )`.as(
              "bookPagesCount",
            ),
        },

        limit,
        offset,
        orderBy: (books, { desc }) => desc(books.id),
      });
      return c.json(res);
    },
  )
  .openapi(
    createRoute({
      method: "get",
      path: "/:bookId",
      request: {
        params: z.object({
          bookId: z.string(),
        }),
        query: z.object({
          page: z.string().optional(),
          // currentPageNumber: z.string().optional(),
          chunkSize: z.string().optional(),
        }),
      },
      responses: {
        200: {
          content: {
            "application/json": {
              schema: z.object({
                title: z.string().nullable(),
                authorId: z.number().nullable(),
                id: z.number(),
                titleTranslit: z.string().nullable(),
                textLength: z.number(),
                textChunk: z.unknown(),
                author: z.object({
                  name: z.string().nullable(),
                  id: z.number(),
                }),
              }),
              // userLikedBooks: ({
              //     ...;
              // } | {
              //     ...;
              // })[];
              // userReadingProgress: ({
              //     ...;
              // } | {
              //     ...;
              // })[];
            },
          },
          description: "Retrive book",
        },
      },
    }),
    async (c) => {
      const userId = c.req.header("Authorization");
      const bookId = +c.req.param("bookId");
      const page = c.req.query("page");
      const chunkSize = +c.req.query("chunkSize")! || 4000;

      const db = connectToDB({
        url: c.env.DATABASE_URL,
        authoToken: c.env.DATABASE_AUTH_TOKEN,
      });

      let dbUser;
      if (userId) {
        try {
          dbUser = await db.query.user.findFirst({
            where: (users, { eq }) => eq(users.sub, userId),
          });
        } catch (e) {
          console.error("error", e);
        }
      }

      const res = await db.query.books.findMany({
        limit: 1,
        where: (books, { eq }) => eq(books.id, bookId),
        columns: {
          id: true,
          title: true,
          text: !page,
          titleTranslit: true,
          authorId: true,
        },
        extras: {
          textLength: sql<number>`length(${books.text})`.as("textLength"),
          ...(page && {
            textChunk:
              sql<string>`substr(${books.text}, ${(+page - 1) * chunkSize}, ${chunkSize})`.as(
                "textChunk",
              ),
          }),
        },
        with: {
          booksToGenre: {
            with: {
              genre: {
                columns: {
                  id: true,
                  name: true,
                  description: true,
                },
              },
            },
          },
          author: {
            columns: {
              id: true,
              name: true,
            },
          },
          ...(dbUser?.id
            ? {
                userLikedBooks: {
                  where: eq(userLikedBooks.userId, dbUser.id),
                  extras: {
                    isLiked: sql<boolean>`true`.as("isLiked"),
                  },
                },
                userReadingProgress: {
                  where: eq(userReadingProgress.userId, dbUser.id),
                  extras: {
                    lastPageNumber:
                      sql<number>`ceil( ${userReadingProgress.lastCharacterIndex} / ${chunkSize} )`.as(
                        "lastPageNumber",
                      ),
                  },
                },
              }
            : {}),
        },
      });
      return c.json(res[0]);
    },
  )
  .post(
    "/favorites",
    zValidator(
      "query",
      z
        .object({
          chunkSize: z.string().optional(),
        })
        .optional(),
    ),
    async (c) => {
      const chunkSize = +c.req.query("chunkSize")! || 4000;
      const db = connectToDB({
        url: c.env.DATABASE_URL,
        authoToken: c.env.DATABASE_AUTH_TOKEN,
      });
      let dbUser: any;
      const userId = c.req.header("Authorization");
      if (userId) {
        try {
          dbUser = await db.query.user.findFirst({
            where: (users, { eq }) => eq(users.sub, userId),
          });
        } catch (e) {
          console.error("error", e);
        }
      }
      const res = await db.query.userLikedBooks.findMany({
        where: (userLikedBooks, { eq }) =>
          dbUser?.id
            ? eq(userLikedBooks.userId, dbUser?.id)
            : eq(userLikedBooks.userId, 0),
        with: {
          book: {
            columns: {
              id: true,
              title: true,
              titleTranslit: true,
              authorId: true,
              authorName: true,
              description: true,
            },
            extras: {
              bookPagesCount:
                sql<number>`ceil( length(${books.text} / ${chunkSize}) )`.as(
                  "bookPagesCount",
                ),
            },
            with: {
              author: {
                columns: {
                  name: true,
                },
              },
              userLikedBooks: {
                where: (userLikedBooks, { eq }) =>
                  dbUser?.id
                    ? eq(userLikedBooks.userId, dbUser?.id)
                    : eq(userLikedBooks.userId, 0),
                extras: {
                  isLiked: sql<boolean>`true`.as("isLiked"),
                },
              },
              userReadingProgress: {
                where: (userReadingProgress, { eq }) =>
                  dbUser?.id
                    ? eq(userReadingProgress.userId, dbUser?.id)
                    : eq(userReadingProgress.userId, 0),
                extras: {
                  lastPageNumber:
                    sql<number>`ceil( ${userReadingProgress.lastCharacterIndex} / ${chunkSize} )`.as(
                      "lastPageNumber",
                    ),
                },
              },
            },
          },
        },
        orderBy: (userLikedBooks, { desc }) => desc(userLikedBooks.createdAt),
      });

      return c.json(res);
    },
  )
  .post(
    "/like",
    zValidator(
      "query",
      z.object({
        bookId: z.string(),
      }),
    ),
    async (c) => {
      const { bookId } = c.req.valid("query");

      if (!bookId) {
        return c.json({ error: "bookId is required" }, 400);
      }

      const db = connectToDB({
        url: c.env.DATABASE_URL,
        authoToken: c.env.DATABASE_AUTH_TOKEN,
      });
      let dbUser: any;
      const userId = c.req.header("Authorization");
      if (userId) {
        try {
          dbUser = await db.query.user.findFirst({
            where: (users, { eq }) => eq(users.sub, userId),
          });
        } catch (e) {
          console.error("error", e);
        }
      }
      const res = await db.insert(userLikedBooks).values({
        userId: dbUser?.id || 0,
        bookId: +bookId,
      });

      return c.json(res);
    },
  )
  .post(
    "/dislike",
    zValidator(
      "query",
      z.object({
        bookId: z.string(),
      }),
    ),
    async (c) => {
      const { bookId } = c.req.valid("query");
      if (!bookId) {
        return c.json({ error: "bookId is required" }, 400);
      }

      const db = connectToDB({
        url: c.env.DATABASE_URL,
        authoToken: c.env.DATABASE_AUTH_TOKEN,
      });
      let dbUser: any;
      const userId = c.req.header("Authorization");
      if (userId) {
        try {
          dbUser = await db.query.user.findFirst({
            where: (users, { eq }) => eq(users.sub, userId),
          });
        } catch (e) {
          console.error("error", e);
        }
      }
      const res = await db
        .delete(userLikedBooks)
        .where(
          and(
            eq(userLikedBooks.bookId, +bookId),
            eq(userLikedBooks.userId, dbUser?.id || 0),
          ),
        );
      return c.json(res);
    },
  );

export default booksRoute;
