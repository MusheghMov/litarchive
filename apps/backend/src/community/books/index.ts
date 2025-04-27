import { zValidator } from "@hono/zod-validator";
import { connectToDB, eq, sql } from "@repo/db";
import { user, userBooks } from "@repo/db/schema";
import { nanoid } from "nanoid";
import OpenAI from "openai";
import slugify from "slugify";
import { createRouter } from "../../lib/create-app";
import { createRoute, z } from "@hono/zod-openapi";

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
                isUserEditor: z.boolean().nullable(),
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
      },
    }),
    async (c) => {
      try {
        const userId = c.req.header("Authorization");
        const slug = c.req.param("slug");

        const db = connectToDB({
          url: c.env.DATABASE_URL,
          authoToken: c.env.DATABASE_AUTH_TOKEN,
        });

        const res = await db.query.userBooks.findFirst({
          where: (userBooks, { eq }) => eq(userBooks.slug, slug),
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
          extras: {
            isUserEditor: sql`(
      SELECT CASE 
        WHEN ${userBooks}.user_id IN (
          SELECT u.id 
          FROM ${user} u 
          WHERE u.sub = ${userId}
        ) THEN TRUE
        ELSE FALSE
      END
    )`.as("isUserEditor"),
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

      c.executionCtx.waitUntil(
        new Promise(async (resolve) => {
          try {
            const coverImageFormData = formData.get(
              "coverImage",
            ) as unknown as File;
            let coverImageUrl;

            if (coverImageFormData && coverImageFormData.size > 0) {
              try {
                const buffer = await coverImageFormData?.arrayBuffer();
                const fileExtension = coverImageFormData?.type.split("/")[1];
                const key = `${nanoid()}.${fileExtension}`;
                const putResult = await c.env.litarchive.put(key, buffer);
                coverImageUrl = `${c.env.IMAGE_STORAGE_URL}/${key}`;
              } catch (error) {
                console.error("Error uploading file:", error);
              }
            } else {
              const openai = new OpenAI({
                apiKey: c.env.OPENAI_API_KEY,
              });

              try {
                const prompt = `Create a cover image for the book titled ${title} and description ${description}`;

                const response = await openai?.images?.generate({
                  model: "dall-e-3",
                  prompt: prompt,
                  n: 1,
                  size: "1024x1024",
                });

                try {
                  const imageUrl = response.data[0].url;
                  const imageResponse = await fetch(imageUrl!);
                  const imageBuffer = await imageResponse.arrayBuffer();
                  const fileExtension = "png";
                  const key = `${nanoid()}.${fileExtension}`;
                  await c.env.litarchive.put(key, imageBuffer);

                  coverImageUrl = `${c.env.IMAGE_STORAGE_URL}/${key}`;
                } catch (error) {
                  console.error("Error fetching image:", error);
                }
              } catch (error) {
                console.error("Error generating cover image:", error);
              }
            }
            if (coverImageUrl) {
              await db
                .update(userBooks)
                .set({
                  coverImageUrl: coverImageUrl,
                })
                .where(eq(userBooks.id, res[0].id));
            }
            resolve(res);
          } catch (error) {
            console.error("Error uploading file:", error);
          }
        }),
      );

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

      const { title, description } = c.req.valid("form");

      const res = await db
        .update(userBooks)
        .set({
          ...(title && { title: title || "" }),
          ...(description && {
            description: description || "",
          }),
        })
        .where(eq(userBooks.id, bookId))
        .returning({
          title: userBooks.title,
          description: userBooks.description,
        });

      return c.json(res);
    },
  );

export default communityBooks;
