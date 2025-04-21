import { createRouter } from "../lib/create-app";
import { createRoute, z } from "@hono/zod-openapi";
import { connectToDB } from "@repo/db";
import { userBooksToGenre } from "@repo/db/schema";
import { zValidator } from "@hono/zod-validator";

const router = createRouter();

const genresRouter = router
  .openapi(
    createRoute({
      path: "/",
      method: "get",
      responses: {
        200: {
          content: {
            "application/json": {
              schema: z.array(
                z.object({
                  id: z.number(),
                  name: z.string().nullable(),
                  description: z.string().nullable(),
                }),
              ),
            },
          },
          description: "Retrieve all genres",
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
        const res = await db.query.genre.findMany();
        return c.json(res, 200);
      } catch (error) {
        console.error("Error fetching genres:", error);
        return c.json({ error: "Error fetching genres" }, 500);
      }
    },
  )
  .post(
    "/community/books/:bookId",
    zValidator(
      "query",
      z.object({
        genreId: z.string(),
      }),
    ),
    async (c) => {
      const userId = c.req.header("Authorization");
      if (!userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const params = c.req.param();
      const bookId = Number.parseInt(params.bookId);
      if (!bookId) {
        return c.json({ error: "Book id is required" }, 400);
      }

      const query = c.req.valid("query");
      const genreId = Number.parseInt(query.genreId);
      if (!genreId) {
        return c.json({ error: "Genre id is required" }, 400);
      }

      const db = connectToDB({
        url: c.env.DATABASE_URL,
        authoToken: c.env.DATABASE_AUTH_TOKEN,
      });

      // check if user is editor of book
      const book = await db.query.userBooks.findFirst({
        where: (userBooks, { eq }) => eq(userBooks.id, bookId),
        with: {
          user: {
            columns: {
              sub: true,
            },
          },
        },
      });

      if (!book) {
        return c.json({ error: "Book not found" }, 404);
      }
      if (book.user.sub !== userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const dbUser = await db.query.user.findFirst({
        where: (users, { eq }) => eq(users.sub, userId),
      });

      if (!dbUser) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const res = await db.insert(userBooksToGenre).values({
        genreId: genreId,
        userBookId: bookId,
      });

      return c.json(res);
    },
  );

export default genresRouter;
