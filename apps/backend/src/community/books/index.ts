import { zValidator } from "@hono/zod-validator";
import { connectToDB, eq } from "@repo/db";
import { userBookCollaborators, userBooks } from "@repo/db/schema";
import { nanoid } from "nanoid";
import slugify from "slugify";
import { createRouter } from "../../lib/create-app";
import { createRoute, z } from "@hono/zod-openapi";
import { getAuth } from "@hono/clerk-auth";

function createUniqueSlug(title: string) {
  const baseSlug = slugify(title, { lower: true, strict: true });
  const uniqueId = nanoid(6);
  return `${baseSlug}-${uniqueId}`;
}

const router = createRouter();

const communityBooks = router
  .openapi(
    createRoute({
      method: "get",
      path: "/",
      responses: {
        200: {
          content: {
            "application/json": {
              schema: z.array(
                z.object({
                  id: z.number(),
                  title: z.string(),
                  slug: z.string().nullable(),
                  description: z.string().nullable(),
                  coverImageUrl: z.string().nullable(),
                  isPublic: z.boolean().nullable(),
                  genres: z.array(
                    z.object({
                      userBookId: z.number(),
                      genreId: z.number(),
                      genre: z.object({
                        description: z.string().nullable(),
                        name: z.string().nullable(),
                        id: z.number(),
                      }),
                    }),
                  ),
                  user: z
                    .object({
                      firstName: z.string().nullable(),
                      lastName: z.string().nullable(),
                      email: z.string().nullable(),
                      imageUrl: z.string().nullable(),
                    })
                    .nullable(),
                }),
              ),
            },
          },
          description: "Retrieve community books of the user",
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

      const res = await db.query.userBooks.findMany({
        where: (userBooks, { eq }) => eq(userBooks.userId, dbUser.id),
        columns: {
          id: true,
          title: true,
          slug: true,
          description: true,
          coverImageUrl: true,
          isPublic: true,
        },
        with: {
          user: {
            columns: {
              firstName: true,
              lastName: true,
              email: true,
              imageUrl: true,
            },
          },
          genres: {
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
        },
        orderBy: (userBooks, { desc }) => desc(userBooks.createdAt),
      });

      return c.json(res, 200);
    },
  )

  .openapi(
    createRoute({
      method: "get",
      path: "/shared-with-me",
      responses: {
        200: {
          content: {
            "application/json": {
              schema: z.array(
                z.object({
                  id: z.number(),
                  userBookId: z.number(),
                  userId: z.number(),
                  createdAt: z.string().nullable(),
                  updatedAt: z.string().nullable(),
                  role: z.enum(["editor", "viewer"]),

                  userBook: z
                    .object({
                      description: z.string().nullable(),
                      title: z.string(),
                      id: z.number(),
                      slug: z.string().nullable(),
                      coverImageUrl: z.string().nullable(),
                      isPublic: z.boolean().nullable(),
                      user: z
                        .object({
                          firstName: z.string().nullable(),
                          lastName: z.string().nullable(),
                          email: z.string().nullable(),
                          imageUrl: z.string().nullable(),
                        })
                        .nullable(),
                      genres: z.array(
                        z.object({
                          userBookId: z.number(),
                          genreId: z.number(),
                          genre: z.object({
                            description: z.string().nullable(),
                            name: z.string().nullable(),
                            id: z.number(),
                          }),
                        }),
                      ),
                    })
                    .nullable(),
                }),
              ),
            },
          },

          description: "Retrieve community books of the user",
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

      const res = await db.query.userBookCollaborators.findMany({
        where: (userBookCollaborator, { eq }) =>
          eq(userBookCollaborator.userId, dbUser.id),
        with: {
          userBook: {
            columns: {
              id: true,
              title: true,
              slug: true,
              description: true,
              coverImageUrl: true,
              isPublic: true,
            },
            with: {
              user: {
                columns: {
                  firstName: true,
                  lastName: true,
                  email: true,
                  imageUrl: true,
                },
              },
              genres: {
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
            },
          },
        },
        orderBy: (userBookCollaborator, { desc }) =>
          desc(userBookCollaborator.createdAt),
      });

      return c.json(res, 200);
    },
  )
  .openapi(
    createRoute({
      method: "get",
      path: "/public",
      responses: {
        200: {
          content: {
            "application/json": {
              schema: z.array(
                z.object({
                  id: z.number(),
                  title: z.string(),
                  slug: z.string().nullable(),
                  description: z.string().nullable(),
                  coverImageUrl: z.string().nullable(),
                  isPublic: z.boolean().nullable(),
                  genres: z.array(
                    z.object({
                      userBookId: z.number(),
                      genreId: z.number(),
                      genre: z.object({
                        description: z.string().nullable(),
                        name: z.string().nullable(),
                        id: z.number(),
                      }),
                    }),
                  ),
                  user: z
                    .object({
                      firstName: z.string().nullable(),
                      lastName: z.string().nullable(),
                      email: z.string().nullable(),
                      imageUrl: z.string().nullable(),
                    })
                    .nullable(),
                }),
              ),
            },
          },
          description: "Retrieve community books",
        },
      },
    }),

    async (c) => {
      const db = connectToDB({
        url: c.env.DATABASE_URL,
        authoToken: c.env.DATABASE_AUTH_TOKEN,
      });

      const res = await db.query.userBooks.findMany({
        where: (userBooks, { eq }) => eq(userBooks.isPublic, true),
        columns: {
          id: true,
          title: true,
          slug: true,
          description: true,
          coverImageUrl: true,
          isPublic: true,
        },
        with: {
          user: {
            columns: {
              firstName: true,
              lastName: true,
              email: true,
              imageUrl: true,
            },
          },
          genres: {
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
        },
        orderBy: (userBooks, { desc }) => desc(userBooks.createdAt),
      });

      return c.json(res, 200);
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
                id: z.number(),
                title: z.string(),
                slug: z.string().nullable(),
                description: z.string().nullable(),
                coverImageUrl: z.string().nullable(),
                imageStatus: z.string().nullable(),
                imageGeneratedAt: z.string().nullable(),
                isPublic: z.boolean().nullable(),
                collaborators: z.array(
                  z.object({
                    id: z.number(),
                    role: z.string(),
                    user: z.object({
                      firstName: z.string().nullable(),
                      lastName: z.string().nullable(),
                      email: z.string().nullable(),
                      imageUrl: z.string().nullable(),
                    }),
                  }),
                ),
                genres: z.array(
                  z.object({
                    userBookId: z.number(),
                    genreId: z.number(),
                    genre: z.object({
                      description: z.string().nullable(),
                      name: z.string().nullable(),
                      id: z.number(),
                    }),
                  }),
                ),
                user: z
                  .object({
                    firstName: z.string().nullable(),
                    lastName: z.string().nullable(),
                    email: z.string().nullable(),
                    imageUrl: z.string().nullable(),
                  })
                  .nullable(),
                isUserAuthor: z.boolean().nullable(),
                isUserEditor: z.boolean().nullable(),
                isUserViewer: z.boolean().nullable(),
              }),
            },
          },
          description: "Retrieve community book by slug",
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
        const slug = c.req.param("slug");

        const db = connectToDB({
          url: c.env.DATABASE_URL,
          authoToken: c.env.DATABASE_AUTH_TOKEN,
        });

        const auth = getAuth(c);
        const userId = auth?.userId;

        let dbUser:
          | {
              id: number;
              firstName: string | null;
              lastName: string | null;
              email: string | null;
              imageUrl: string | null;
              sub: string | null;
            }
          | undefined;
        if (userId) {
          dbUser = await db.query.user.findFirst({
            where: (users, { eq }) => eq(users.sub, userId!),
          });
          if (!dbUser) {
            return c.json({ error: "Unauthorized" }, 401);
          }
        }

        if (dbUser) {
          const bookId = await db.query.userBooks
            .findFirst({
              where: (userBooks, { eq }) => eq(userBooks.slug, slug),
            })
            .then((res) => res?.id);

          if (!bookId) {
            return c.json({ error: "Book not found" }, 404);
          }

          const isUserAuthor = await db.query.userBooks
            .findFirst({
              where: (userBooks, { eq }) =>
                eq(userBooks.id, Number.parseInt(bookId.toString())),
            })
            .then((res) => res?.userId === dbUser?.id);

          let isUserEditor = false;
          let isUserViewer = false;

          await db.query.userBookCollaborators
            .findFirst({
              where: (userBookCollaborators, { eq, and }) =>
                and(
                  eq(userBookCollaborators.userBookId, bookId),
                  eq(userBookCollaborators.userId, dbUser?.id),
                ),
            })
            .then((res) => {
              if (res && res.role === "editor") {
                isUserEditor = true;
              }
              if (res && res.role === "viewer") {
                isUserViewer = true;
              }
            });

          const res = await db.query.userBooks.findFirst({
            where: (userBooks, { eq }) => eq(userBooks.slug, slug),
            columns: {
              id: true,
              title: true,
              slug: true,
              description: true,
              coverImageUrl: true,
              imageStatus: true,
              imageGeneratedAt: true,
              isPublic: true,
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
                    },
                  },
                },
              },
              user: {
                columns: {
                  firstName: true,
                  lastName: true,
                  email: true,
                  imageUrl: true,
                },
              },
              genres: {
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
            },
          });

          const finalRes = {
            ...res!,
            isUserAuthor: isUserAuthor,
            isUserEditor: isUserEditor,
            isUserViewer: isUserViewer,
          };

          return c.json(finalRes, 200);
        }
        const res = await db.query.userBooks.findFirst({
          where: (userBooks, { eq }) => eq(userBooks.slug, slug),
          columns: {
            id: true,
            title: true,
            slug: true,
            description: true,
            coverImageUrl: true,
            imageStatus: true,
            imageGeneratedAt: true,
            isPublic: true,
          },
          with: {
            user: {
              columns: {
                firstName: true,
                lastName: true,
                email: true,
                imageUrl: true,
              },
            },
            genres: {
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
          },
        });

        return c.json(res, 200);
      } catch (error) {
        console.error("Error fetching community book:", error);
        return c.json({ error: "Error fetching community book" }, 500);
      }
    },
  )
  .post(
    "/",
    zValidator(
      "form",
      z.object({
        title: z.string(),
        description: z.string().optional(),
        coverImage: z.any().optional(),
        isPublic: z.string().optional(),
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

      const formData = await c.req.formData();

      const title = formData.get("title") as string;

      if (!title) {
        return c.json({ error: "Title is required" }, 400);
      }

      const slug = createUniqueSlug(title);
      const description = formData.get("description") as string;
      const isPublic = formData.get("isPublic") === "true";

      const res: { id: number; slug: string | null }[] = await db
        .insert(userBooks)
        .values({
          userId: dbUser.id,
          title: title,
          description: description,
          slug: slug,
          isPublic: isPublic,
        })
        .returning({ id: userBooks.id, slug: userBooks.slug });

      const coverImageFormData = formData.get("coverImage") as unknown as File;

      if (coverImageFormData && coverImageFormData.size > 0) {
        c.executionCtx.waitUntil(
          (async () => {
            try {
              const fileExtension = coverImageFormData?.type.split("/")[1];
              const key = `${nanoid()}.${fileExtension}`;
              await c.env.litarchive.put(key, coverImageFormData);
              const coverImageUrl = `${c.env.IMAGE_STORAGE_URL}/${key}`;

              await db
                .update(userBooks)
                .set({
                  coverImageUrl: coverImageUrl,
                })
                .where(eq(userBooks.id, res[0].id));
            } catch (error) {
              console.error("Error uploading cover image:", error);
            }
          })(),
        );
      } else {
        try {
          db.update(userBooks)
            .set({
              imageStatus: "pending",
            })
            .where(eq(userBooks.id, res[0].id));

          await c.env.IMAGE_GENERATION_WORKFLOW.create({
            params: {
              bookId: res[0].id,
              title: title,
              author: dbUser.firstName + " " + dbUser.lastName,
              description: description || "",
              databaseUrl: c.env.DATABASE_URL,
              databaseAuthToken: c.env.DATABASE_AUTH_TOKEN,
              imageStorageUrl: c.env.IMAGE_STORAGE_URL,
              geminiApiKey: c.env.GEMINI_API_KEY,
            },
          });
        } catch (error) {
          console.error("Error starting image generation workflow:", error);

          await db
            .update(userBooks)
            .set({
              imageStatus: "failed",
            })
            .where(eq(userBooks.id, res[0].id));
        }
      }

      return c.json(res);
    },
  )
  .put(
    "/:bookId",
    zValidator(
      "form",
      z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        isPublic: z.string().optional(),
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

      const { title, description, isPublic } = c.req.valid("form");
      const isPublicBoolean = isPublic === "true";

      const res = await db
        .update(userBooks)
        .set({
          ...(title && { title: title || "" }),
          ...(description && {
            description: description || "",
          }),
          ...(isPublic && { isPublic: isPublicBoolean }),
        })
        .where(eq(userBooks.id, bookId))
        .returning({
          title: userBooks.title,
          description: userBooks.description,
          isPublic: userBooks.isPublic,
        });

      return c.json(res);
    },
  )
  .delete("/:bookId", async (c) => {
    const auth = getAuth(c);
    const userId = auth?.userId;
    if (!userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    const params = c.req.param();
    const bookId = Number.parseInt(params.bookId);

    if (!bookId) {
      return c.json({ error: "Book id is required" }, 400);
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

    const isUserEditor = await db.query.userBooks
      .findFirst({
        where: (userBooks, { eq }) => eq(userBooks.id, bookId),
      })
      .then((res) => res?.userId === dbUser.id);

    if (!isUserEditor) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const res = await db.delete(userBooks).where(eq(userBooks.id, bookId));

    return c.json(res);
  })
  .get("/:bookSlug/image-status", async (c) => {
    try {
      const bookSlug = c.req.param("bookSlug");

      const db = connectToDB({
        url: c.env.DATABASE_URL,
        authoToken: c.env.DATABASE_AUTH_TOKEN,
      });

      const book = await db.query.userBooks.findFirst({
        where: (userBooks, { eq }) => eq(userBooks.slug, bookSlug),
        columns: {
          id: true,
          imageStatus: true,
          coverImageUrl: true,
          imageGeneratedAt: true,
        },
      });

      if (!book) {
        return c.json({ error: "Book not found" }, 404);
      }

      return c.json({
        bookId: book.id,
        imageStatus: book.imageStatus,
        coverImageUrl: book.coverImageUrl,
        imageGeneratedAt: book.imageGeneratedAt,
      });
    } catch (error) {
      console.error("Error fetching image status:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  })
  .post(
    "/collaboration/create",
    zValidator(
      "query",
      z.object({
        bookId: z.string(),
        collaboratorEmail: z.string(),
        role: z.enum(["viewer", "editor"]),
      }),
    ),
    async (c) => {
      const auth = getAuth(c);
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      const userId = auth.userId;

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

      const query = c.req.query();

      const bookId = query.bookId as string;
      if (!bookId) {
        return c.json({ error: "Book id is required" }, 400);
      }

      const collaboratorEmail = query.collaboratorEmail as string;
      if (!collaboratorEmail) {
        return c.json({ error: "Collaborator email is required" }, 400);
      }

      const role = query.role as string;
      if (!role) {
        return c.json({ error: "Role is required" }, 400);
      }

      const isUserAuthor = await db.query.userBooks
        .findFirst({
          where: (userBooks, { eq }) =>
            eq(userBooks.id, Number.parseInt(bookId)),
        })
        .then((res) => res?.userId === dbUser.id);

      if (!isUserAuthor) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const collaborator = await db.query.user.findFirst({
        where: (users, { eq }) => eq(users.email, collaboratorEmail),
      });
      if (!collaborator) {
        return c.json({ error: "Collaborator not found" }, 404);
      }

      if (role === "viewer") {
        try {
          const res = await db
            .insert(userBookCollaborators)
            .values({
              userId: collaborator.id,
              userBookId: Number.parseInt(bookId),
              role: "viewer",
            })
            .returning({ id: userBookCollaborators.id });
          return c.json(res);
        } catch (error) {
          console.error("Error adding collaborator:", error);
          return c.json({ error: "Error adding collaborator" }, 500);
        }
      }

      try {
        const res = await db
          .insert(userBookCollaborators)
          .values({
            userId: collaborator.id,
            userBookId: Number.parseInt(bookId),
            role: "editor",
          })
          .returning({ id: userBookCollaborators.id });
        return c.json(res);
      } catch (error) {
        console.error("Error adding collaborator:", error);
        return c.json({ error: "Error adding collaborator" }, 500);
      }
    },
  )
  .post(
    "/collaboration/update",
    zValidator(
      "query",
      z.object({
        bookId: z.string(),
        userBookCollaboratorsId: z.string(),
        role: z.enum(["viewer", "editor"]),
      }),
    ),
    async (c) => {
      const auth = getAuth(c);
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      const userId = auth.userId;

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

      const query = c.req.query();

      const bookId = query.bookId;
      if (!bookId) {
        return c.json({ error: "Book id is required" }, 400);
      }

      const userBookCollaboratorsId = query.userBookCollaboratorsId;
      if (!userBookCollaboratorsId) {
        return c.json({ error: "User book collaborator id is required" }, 400);
      }

      const role = query.role;
      if ((role !== "viewer" && role !== "editor") || !role) {
        return c.json({ error: "Role is required" }, 400);
      }

      const isUserAuthor = await db.query.userBooks
        .findFirst({
          where: (userBooks, { eq }) =>
            eq(userBooks.id, Number.parseInt(bookId)),
        })
        .then((res) => res?.userId === dbUser.id);

      if (!isUserAuthor) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      try {
        const res = await db
          .update(userBookCollaborators)
          .set({
            role: role,
          })
          .where(
            eq(
              userBookCollaborators.id,
              Number.parseInt(userBookCollaboratorsId),
            ),
          )
          .returning({
            id: userBookCollaborators.id,
            userId: userBookCollaborators.userId,
            userBookId: userBookCollaborators.userBookId,
            role: userBookCollaborators.role,
          });
        return c.json(res);
      } catch (error) {
        console.error("Error adding collaborator:", error);
        return c.json({ error: "Error adding collaborator" }, 500);
      }
    },
  )
  .delete(
    "/collaboration/delete",
    zValidator(
      "query",
      z.object({
        userBookCollaboratorsId: z.string(),
        bookId: z.string(),
      }),
    ),
    async (c) => {
      const auth = getAuth(c);
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      const userId = auth.userId;

      const query = c.req.query();

      const bookId = Number.parseInt(query.bookId);
      if (!bookId) {
        return c.json({ error: "Book id is required" }, 400);
      }

      const userBookCollaboratorsId = Number.parseInt(
        query.userBookCollaboratorsId,
      );
      if (!userBookCollaboratorsId) {
        return c.json({ error: "userBookCollaboratorsId is required" }, 400);
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

      const isUserAuthor = await db.query.userBooks
        .findFirst({
          where: (userBooks, { eq }) => eq(userBooks.id, bookId),
        })
        .then((res) => res?.userId === dbUser.id);

      if (!isUserAuthor) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const res = await db
        .delete(userBookCollaborators)
        .where(eq(userBookCollaborators.id, userBookCollaboratorsId));
      return c.json(res);
    },
  );

function generateBookCoverPrompt(bookData: any) {
  const {
    title,
    author,
    synopsis,
    genre,
    targetAudience,
    mood,
    setting,
    artStyle,
    colorScheme,
    typographyStyle,
    mainSubject,
    background,
    symbolicElements,
    aspectRatio = "1:1",
    textPlacement = "title at top and author name at bottom",
    additionalRequirements = "image should be a high quality 1024x1024 image",
  } = bookData;

  return `Generate a high quality 1024x1024 book cover image for "${title}" by ${author}.

**Book Details:**
- Genre: ${genre}
- Synopsis: ${synopsis}
- Target Audience: ${targetAudience}
- Mood/Tone: ${mood}
- Setting: ${setting}

**Visual Style:**
- Art Style: ${artStyle}
- Color Scheme: ${colorScheme}
- Typography Style: ${typographyStyle}

**Key Visual Elements:**
- Main Subject: ${mainSubject}
- Background: ${background}
- Symbolic Elements: ${symbolicElements}

**Technical Specifications:**
- Aspect Ratio: ${aspectRatio} for standard book cover
- Image Quality: High resolution, professional publishing quality
- Text Placement: Leave space for ${textPlacement}

${additionalRequirements ? `**Specific Instructions:**\n${additionalRequirements}\n` : ""}
Create an eye-catching, marketable book cover that would attract readers browsing an online bookstore.`;
}
export default communityBooks;
