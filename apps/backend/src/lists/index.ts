import { connectToDB, sql, eq, and } from "@repo/db";
import { z, createRoute } from "@hono/zod-openapi";
import { createRouter } from "../lib/create-app";
import { bookLists, booksToLists, books } from "@repo/db/schema";
import { zValidator } from "@hono/zod-validator";

const router = createRouter();

const listsRoute = router
  .openapi(
    createRoute({
      method: "get",
      path: "/",
      request: {
        query: z.object({
          limit: z.string().optional(),
        }),
      },
      responses: {
        200: {
          content: {
            "application/json": {
              schema: z.array(
                z.object({
                  id: z.number(),
                  name: z.string(),
                  description: z.string().nullable(),
                  isPublic: z.boolean(),
                  createdAt: z.string().nullable(),
                  updatedAt: z.string().nullable(),
                  bookCount: z.number(),
                  booksToLists: z.array(
                    z.object({
                      listId: z.number(),
                      bookId: z.number(),
                      notes: z.string().nullable(),
                      createdAt: z.string().nullable(),
                      updatedAt: z.string().nullable(),
                      book: z.object({
                        id: z.number(),
                        title: z.string().nullable(),
                        titleTranslit: z.string().nullable(),
                        authorId: z.number(),
                        authorName: z.string().nullable(),
                      }),
                    }),
                  ),
                }),
              ),
            },
          },
          description: "Retrieve user's book lists with books",
        },
        401: {
          description: "Unauthorized",
        },
      },
    }),
    async (c) => {
      const limit = parseInt(c.req.query("limit") as string);
      const userId = c.req.header("Authorization");

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

      const userLists = await db.query.bookLists.findMany({
        where: (lists, { eq }) => eq(lists.userId, dbUser.id),
        orderBy: (lists, { desc }) => desc(lists.updatedAt),
        extras: {
          bookCount: sql<number>`(
           SELECT COUNT(*)
           FROM ${booksToLists}
           WHERE ${booksToLists.listId} = ${bookLists.id}
         )`.as("bookCount"),
        },
        with: {
          booksToLists: {
            with: {
              book: {
                columns: {
                  id: true,
                  title: true,
                  titleTranslit: true,
                  authorId: true,
                  authorName: true,
                },
              },
            },
            columns: {
              listId: true,
              bookId: true,
              notes: true,
              createdAt: true,
              updatedAt: true,
            },
            orderBy: (lists, { desc }) => desc(lists.updatedAt),
            limit: 3,
          },
        },
        ...(limit > 0 && { limit }),
      });

      return c.json(userLists);
    },
  )

  // Get public lists
  // .openapi(
  //   createRoute({
  //     method: "get",
  //     path: "/public",
  //     responses: {
  //       200: {
  //         content: {
  //           "application/json": {
  //             schema: z.array(
  //               z.object({
  //                 id: z.number(),
  //                 name: z.string(),
  //                 description: z.string().nullable(),
  //                 createdAt: z.string().nullable(),
  //                 updatedAt: z.string().nullable(),
  //                 bookCount: z.number(),
  //                 user: z.object({
  //                   firstName: z.string().nullable(),
  //                   lastName: z.string().nullable(),
  //                 }),
  //               }),
  //             ),
  //           },
  //         },
  //         description: "Retrieve public book lists",
  //       },
  //     },
  //   }),
  //   async (c) => {
  //     const db = connectToDB({
  //       url: c.env.DATABASE_URL,
  //       authoToken: c.env.DATABASE_AUTH_TOKEN,
  //     });
  //
  //     const lists = await db.query.bookLists.findMany({
  //       where: (lists, { eq }) => eq(lists.isPublic, true),
  //       with: {
  //         user: {
  //           columns: {
  //             firstName: true,
  //             lastName: true,
  //           },
  //         },
  //       },
  //       extras: {
  //         bookCount: sql<number>`(
  //           SELECT COUNT(*)
  //           FROM ${booksToLists}
  //           WHERE ${booksToLists.listId} = ${bookLists.id}
  //         )`,
  //       },
  //       orderBy: (lists, { desc }) => desc(lists.updatedAt),
  //     });
  //
  //     return c.json(lists);
  //   },
  // )

  // Get a single list with its books
  .openapi(
    createRoute({
      method: "get",
      path: "/:listId",
      request: {
        params: z.object({
          listId: z.string(),
        }),
      },
      responses: {
        200: {
          content: {
            "application/json": {
              schema: z.object({
                id: z.number(),
                name: z.string(),
                description: z.string().nullable(),
                isPublic: z.boolean(),
                createdAt: z.string().nullable(),
                updatedAt: z.string().nullable(),
                user: z.object({
                  firstName: z.string().nullable(),
                  lastName: z.string().nullable(),
                }),
                books: z.array(
                  z.object({
                    id: z.number(),
                    title: z.string().nullable(),
                    titleTranslit: z.string().nullable(),
                    author: z.object({
                      id: z.number(),
                      name: z.string().nullable(),
                    }),
                    notes: z.string().nullable(),
                    createdAt: z.string().nullable(),
                    updatedAt: z.string().nullable(),
                  }),
                ),
              }),
            },
          },
          description: "Retrieve a book list with its books",
        },
        404: {
          description: "List not found",
        },
      },
    }),
    async (c) => {
      const listId = c.req.param("listId");
      const userId = c.req.header("Authorization");

      const db = connectToDB({
        url: c.env.DATABASE_URL,
        authoToken: c.env.DATABASE_AUTH_TOKEN,
      });

      let dbUser = null;
      if (userId) {
        try {
          dbUser = await db.query.user.findFirst({
            where: (users, { eq }) => eq(users.sub, userId),
          });
        } catch (e) {
          console.error("Error fetching user:", e);
        }
      }

      const list = await db.query.bookLists.findFirst({
        where: (lists, { eq, and, or }) =>
          and(
            eq(lists.id, parseInt(listId)),
            dbUser
              ? or(eq(lists.isPublic, true), eq(lists.userId, dbUser.id))
              : eq(lists.isPublic, true),
          ),
        with: {
          user: {
            columns: {
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      if (!list) {
        return c.json({ error: "List not found" }, 404);
      }

      const booksInList = await db
        .select({
          id: books.id,
          title: books.title,
          titleTranslit: books.titleTranslit,
          author: {
            id: books.authorId,
            name: books.authorName,
          },
          notes: booksToLists.notes,
          createdAt: booksToLists.createdAt,
          updatedAt: booksToLists.updatedAt,
        })
        .from(booksToLists)
        .innerJoin(books, eq(booksToLists.bookId, books.id))
        .where(eq(booksToLists.listId, parseInt(listId)))
        .orderBy(booksToLists.createdAt);

      return c.json({
        ...list,
        books: booksInList,
      });
    },
  )

  // Create a new list
  .openapi(
    createRoute({
      method: "post",
      path: "/",
      request: {
        body: {
          content: {
            "application/json": {
              schema: z.object({
                name: z.string().min(1),
                description: z.string().optional(),
                isPublic: z.boolean().optional(),
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
                id: z.number(),
              }),
            },
          },
          description: "Retrieve user's book lists with books",
        },
        401: {
          description: "Unauthorized",
        },
        404: {
          description: "Bad request",
        },
      },
    }),
    async (c) => {
      const userId = c.req.header("Authorization");
      if (!userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { name, description, isPublic } = c.req.valid("json");

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

      const result = await db.insert(bookLists).values({
        name,
        userId: dbUser.id,
        description,
        isPublic: isPublic || false,
      });
      const id = Number(result.lastInsertRowid);

      return c.json({
        message: "List created successfully",
        id,
      });
    },
  )

  // Update a list
  .put(
    "/:listId",
    zValidator(
      "json",
      z.object({
        name: z.string().min(1).optional(),
        description: z.string().optional().nullable(),
        isPublic: z.boolean().optional(),
      }),
    ),
    async (c) => {
      const userId = c.req.header("Authorization");
      if (!userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const listId = c.req.param("listId");
      const updates = c.req.valid("json");

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

      // Check if the list belongs to the user
      const list = await db.query.bookLists.findFirst({
        where: (lists, { eq, and }) =>
          and(eq(lists.id, parseInt(listId)), eq(lists.userId, dbUser.id)),
      });

      if (!list) {
        return c.json({ error: "List not found or not authorized" }, 404);
      }

      await db
        .update(bookLists)
        .set({
          ...updates,
          updatedAt: sql`CURRENT_TIMESTAMP`,
        })
        .where(eq(bookLists.id, parseInt(listId)));

      return c.json({
        message: "List updated successfully",
      });
    },
  )

  // Delete a list
  .delete("/:listId", async (c) => {
    const userId = c.req.header("Authorization");
    if (!userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const listId = c.req.param("listId");

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

    // Check if the list belongs to the user
    const list = await db.query.bookLists.findFirst({
      where: (lists, { eq, and }) =>
        and(eq(lists.id, parseInt(listId)), eq(lists.userId, dbUser.id)),
    });

    if (!list) {
      return c.json({ error: "List not found or not authorized" }, 404);
    }

    // Delete the list-book associations first
    await db
      .delete(booksToLists)
      .where(eq(booksToLists.listId, parseInt(listId)));

    // Then delete the list
    await db.delete(bookLists).where(eq(bookLists.id, parseInt(listId)));

    return c.json({
      message: "List deleted successfully",
    });
  })

  // Add a book to a list
  .post(
    "/:listId/books/:bookId",
    zValidator(
      "json",
      z.object({
        notes: z.string().optional(),
      }),
    ),
    async (c) => {
      const userId = c.req.header("Authorization");
      if (!userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const listId = c.req.param("listId");
      const bookId = c.req.param("bookId");
      const { notes } = c.req.valid("json");

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

      // Check if the list belongs to the user
      const list = await db.query.bookLists.findFirst({
        where: (lists, { eq, and }) =>
          and(eq(lists.id, parseInt(listId)), eq(lists.userId, dbUser.id)),
      });

      if (!list) {
        return c.json({ error: "List not found or not authorized" }, 404);
      }

      // Check if book exists
      const book = await db.query.books.findFirst({
        where: (books, { eq }) => eq(books.id, parseInt(bookId)),
      });

      if (!book) {
        return c.json({ error: "Book not found" }, 404);
      }

      // Check if book is already in the list
      const existingEntry = await db.query.booksToLists.findFirst({
        where: (btl, { eq, and }) =>
          and(
            eq(btl.listId, parseInt(listId)),
            eq(btl.bookId, parseInt(bookId)),
          ),
      });

      if (existingEntry) {
        // If it exists, update the notes
        await db
          .update(booksToLists)
          .set({
            notes,
            createdAt: sql`CURRENT_TIMESTAMP`,
          })
          .where(
            and(
              eq(booksToLists.listId, parseInt(listId)),
              eq(booksToLists.bookId, parseInt(bookId)),
            ),
          );

        return c.json({
          message: "Book updated in list",
        });
      }

      // Add book to list
      await db.insert(booksToLists).values({
        listId: parseInt(listId),
        bookId: parseInt(bookId),
        notes,
      });

      // Update the list's updatedAt timestamp
      await db
        .update(bookLists)
        .set({
          updatedAt: sql`CURRENT_TIMESTAMP`,
        })
        .where(eq(bookLists.id, parseInt(listId)));

      return c.json({
        message: "Book added to list successfully",
      });
    },
  )

  // Remove a book from a list
  .delete("/:listId/books/:bookId", async (c) => {
    const userId = c.req.header("Authorization");
    if (!userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const listId = c.req.param("listId");
    const bookId = c.req.param("bookId");

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

    // Check if the list belongs to the user
    const list = await db.query.bookLists.findFirst({
      where: (lists, { eq, and }) =>
        and(eq(lists.id, parseInt(listId)), eq(lists.userId, dbUser.id)),
    });

    if (!list) {
      return c.json({ error: "List not found or not authorized" }, 404);
    }

    // Remove book from list
    await db
      .delete(booksToLists)
      .where(
        and(
          eq(booksToLists.listId, parseInt(listId)),
          eq(booksToLists.bookId, parseInt(bookId)),
        ),
      );

    // Update the list's updatedAt timestamp
    await db
      .update(bookLists)
      .set({
        updatedAt: sql`CURRENT_TIMESTAMP`,
      })
      .where(eq(bookLists.id, parseInt(listId)));

    return c.json({
      message: "Book removed from list successfully",
    });
  });

export default listsRoute;
