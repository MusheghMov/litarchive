import { connectToDB, sql, eq, and } from "@repo/db";
import { z, createRoute } from "@hono/zod-openapi";
import { createRouter } from "../lib/create-app";
import { bookRatings, authorRatings } from "@repo/db/schema";
import { zValidator } from "@hono/zod-validator";

const router = createRouter();

// Schema for creating/updating ratings
const ratingSchema = z.object({
  rating: z.number().min(1).max(5),
  review: z.string().optional(),
});

const ratingsRoute = router
  // Get user's book ratings
  // .openapi(
  //   createRoute({
  //     method: "get",
  //     path: "/books",
  //     tags: ["ratings"],
  //     request: {
  //       query: z.object({
  //         bookId: z.string().optional(),
  //       }),
  //     },
  //     responses: {
  //       200: {
  //         content: {
  //           "application/json": {
  //             schema: z.array(
  //               z.object({
  //                 id: z.number(),
  //                 userId: z.number(),
  //                 bookId: z.number(),
  //                 rating: z.number(),
  //                 review: z.string().nullable(),
  //                 createdAt: z.string().nullable(),
  //                 updatedAt: z.string().nullable(),
  //               }),
  //             ),
  //           },
  //         },
  //         description: "Retrieve book ratings",
  //       },
  //     },
  //   }),
  //   async (c) => {
  //     const userId = c.req.header("Authorization");
  //     const bookId = c.req.query("bookId");
  //
  //     if (!userId) {
  //       return c.json({ error: "Unauthorized" }, 401);
  //     }
  //
  //     const db = connectToDB({
  //       url: c.env.DATABASE_URL,
  //       authoToken: c.env.DATABASE_AUTH_TOKEN,
  //     });
  //
  //     let dbUser;
  //     try {
  //       dbUser = await db.query.user.findFirst({
  //         where: (users, { eq }) => eq(users.sub, userId),
  //       });
  //     } catch (e) {
  //       console.error("error", e);
  //       return c.json({ error: "User not found" }, 404);
  //     }
  //
  //     if (!dbUser) {
  //       return c.json({ error: "User not found" }, 404);
  //     }
  //
  //     // If bookId is provided, get rating for specific book
  //     if (bookId) {
  //       const rating = await db.query.bookRatings.findFirst({
  //         where: (ratings, { and, eq }) =>
  //           and(
  //             eq(ratings.userId, dbUser.id),
  //             eq(ratings.bookId, parseInt(bookId)),
  //           ),
  //       });
  //       return c.json(rating || null);
  //     }
  //
  //     // Otherwise get all user's book ratings
  //     const ratings = await db.query.bookRatings.findMany({
  //       where: (ratings, { eq }) => eq(ratings.userId, dbUser.id),
  //       with: {
  //         book: {
  //           columns: {
  //             id: true,
  //             title: true,
  //             titleTranslit: true,
  //           },
  //         },
  //       },
  //     });
  //
  //     return c.json(ratings);
  //   },
  // )
  // .openapi(
  //   createRoute({
  //     method: "get",
  //     path: "/authors",
  //     tags: ["ratings"],
  //     request: {
  //       query: z.object({
  //         authorId: z.string().optional(),
  //       }),
  //     },
  //     responses: {
  //       200: {
  //         content: {
  //           "application/json": {
  //             schema: z.array(
  //               z.object({
  //                 id: z.number(),
  //                 userId: z.number(),
  //                 authorId: z.number(),
  //                 rating: z.number(),
  //                 review: z.string().nullable(),
  //                 createdAt: z.string().nullable(),
  //                 updatedAt: z.string().nullable(),
  //               }),
  //             ),
  //           },
  //         },
  //         description: "Retrieve author ratings",
  //       },
  //     },
  //   }),
  //   async (c) => {
  //     const userId = c.req.header("Authorization");
  //     const authorId = c.req.query("authorId");
  //
  //     if (!userId) {
  //       return c.json({ error: "Unauthorized" }, 401);
  //     }
  //
  //     const db = connectToDB({
  //       url: c.env.DATABASE_URL,
  //       authoToken: c.env.DATABASE_AUTH_TOKEN,
  //     });
  //
  //     let dbUser;
  //     try {
  //       dbUser = await db.query.user.findFirst({
  //         where: (users, { eq }) => eq(users.sub, userId),
  //       });
  //     } catch (e) {
  //       console.error("error", e);
  //       return c.json({ error: "User not found" }, 404);
  //     }
  //
  //     if (!dbUser) {
  //       return c.json({ error: "User not found" }, 404);
  //     }
  //
  //     // If authorId is provided, get rating for specific author
  //     if (authorId) {
  //       const rating = await db.query.authorRatings.findFirst({
  //         where: (ratings, { and, eq }) =>
  //           and(
  //             eq(ratings.userId, dbUser.id),
  //             eq(ratings.authorId, parseInt(authorId)),
  //           ),
  //       });
  //       return c.json(rating || null);
  //     }
  //
  //     // Otherwise get all user's author ratings
  //     const ratings = await db.query.authorRatings.findMany({
  //       where: (ratings, { eq }) => eq(ratings.userId, dbUser.id),
  //       with: {
  //         author: {
  //           columns: {
  //             id: true,
  //             name: true,
  //           },
  //         },
  //       },
  //     });
  //
  //     return c.json(ratings);
  //   },
  // )
  .post("/books/:bookId", zValidator("json", ratingSchema), async (c) => {
    const userId = c.req.header("Authorization");
    const bookId = c.req.param("bookId");
    const { rating, review } = c.req.valid("json");

    if (!userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const db = connectToDB({
      url: c.env.DATABASE_URL,
      authoToken: c.env.DATABASE_AUTH_TOKEN,
    });

    let dbUser;
    try {
      dbUser = await db.query.user.findFirst({
        where: (users, { eq }) => eq(users.sub, userId),
      });
    } catch (e) {
      console.error("error", e);
      return c.json({ error: "User not found" }, 404);
    }

    if (!dbUser) {
      return c.json({ error: "User not found" }, 404);
    }

    // Check if book exists
    const book = await db.query.books.findFirst({
      where: (books, { eq }) => eq(books.id, parseInt(bookId)),
    });

    if (!book) {
      return c.json({ error: "Book not found" }, 404);
    }

    // Check if rating already exists
    const existingRating = await db.query.bookRatings.findFirst({
      where: (ratings, { and, eq }) =>
        and(
          eq(ratings.userId, dbUser.id),
          eq(ratings.bookId, parseInt(bookId)),
        ),
    });

    let result;
    if (existingRating) {
      // Update existing rating
      result = await db
        .update(bookRatings)
        .set({
          rating,
          review,
          updatedAt: sql`CURRENT_TIMESTAMP`,
        })
        .where(
          and(
            eq(bookRatings.userId, dbUser.id),
            eq(bookRatings.bookId, parseInt(bookId)),
          ),
        );
      return c.json({
        message: "Rating updated successfully",
        id: existingRating.id,
      });
    } else {
      // Create new rating
      result = await db.insert(bookRatings).values({
        userId: dbUser.id,
        bookId: parseInt(bookId),
        rating,
        review,
      });
      return c.json({
        message: "Rating created successfully",
        id: result.lastInsertRowid,
      });
    }
  })
  .post("/authors/:authorId", zValidator("json", ratingSchema), async (c) => {
    const userId = c.req.header("Authorization");
    const authorId = c.req.param("authorId");
    const { rating, review } = c.req.valid("json");

    if (!userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const db = connectToDB({
      url: c.env.DATABASE_URL,
      authoToken: c.env.DATABASE_AUTH_TOKEN,
    });

    let dbUser;
    try {
      dbUser = await db.query.user.findFirst({
        where: (users, { eq }) => eq(users.sub, userId),
      });
    } catch (e) {
      console.error("error", e);
      return c.json({ error: "User not found" }, 404);
    }

    if (!dbUser) {
      return c.json({ error: "User not found" }, 404);
    }

    // Check if author exists
    const author = await db.query.authors.findFirst({
      where: (authors, { eq }) => eq(authors.id, parseInt(authorId)),
    });

    if (!author) {
      return c.json({ error: "Author not found" }, 404);
    }

    // Check if rating already exists
    const existingRating = await db.query.authorRatings.findFirst({
      where: (ratings, { and, eq }) =>
        and(
          eq(ratings.userId, dbUser.id),
          eq(ratings.authorId, parseInt(authorId)),
        ),
    });

    let result;
    if (existingRating) {
      // Update existing rating
      result = await db
        .update(authorRatings)
        .set({
          rating,
          review,
          updatedAt: sql`CURRENT_TIMESTAMP`,
        })
        .where(
          and(
            eq(authorRatings.userId, dbUser.id),
            eq(authorRatings.authorId, parseInt(authorId)),
          ),
        );
      return c.json({
        message: "Rating updated successfully",
        id: existingRating.id,
      });
    } else {
      // Create new rating
      result = await db.insert(authorRatings).values({
        userId: dbUser.id,
        authorId: parseInt(authorId),
        rating,
        review,
      });
      return c.json({
        message: "Rating created successfully",
        id: result.lastInsertRowid,
      });
    }
  })
  .delete("/books/:bookId", async (c) => {
    const userId = c.req.header("Authorization");
    const bookId = c.req.param("bookId");

    if (!userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const db = connectToDB({
      url: c.env.DATABASE_URL,
      authoToken: c.env.DATABASE_AUTH_TOKEN,
    });

    let dbUser;
    try {
      dbUser = await db.query.user.findFirst({
        where: (users, { eq }) => eq(users.sub, userId),
      });
    } catch (e) {
      console.error("error", e);
      return c.json({ error: "User not found" }, 404);
    }

    if (!dbUser) {
      return c.json({ error: "User not found" }, 404);
    }

    // Delete rating
    const result = await db
      .delete(bookRatings)
      .where(
        and(
          eq(bookRatings.userId, dbUser.id),
          eq(bookRatings.bookId, parseInt(bookId)),
        ),
      );

    return c.json({ message: "Rating deleted successfully", result });
  })
  .delete("/authors/:authorId", async (c) => {
    const userId = c.req.header("Authorization");
    const authorId = c.req.param("authorId");

    if (!userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const db = connectToDB({
      url: c.env.DATABASE_URL,
      authoToken: c.env.DATABASE_AUTH_TOKEN,
    });

    let dbUser;
    try {
      dbUser = await db.query.user.findFirst({
        where: (users, { eq }) => eq(users.sub, userId),
      });
    } catch (e) {
      console.error("error", e);
      return c.json({ error: "User not found" }, 404);
    }

    if (!dbUser) {
      return c.json({ error: "User not found" }, 404);
    }

    // Delete rating
    const result = await db
      .delete(authorRatings)
      .where(
        and(
          eq(authorRatings.userId, dbUser.id),
          eq(authorRatings.authorId, parseInt(authorId)),
        ),
      );

    return c.json({ message: "Rating deleted successfully", result });
  });

export default ratingsRoute;
