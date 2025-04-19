import { zValidator } from "@hono/zod-validator";
import { connectToDB, eq } from "@repo/db";
import { userBooks } from "@repo/db/schema";
import { nanoid } from "nanoid";
import OpenAI from "openai";
import slugify from "slugify";
import { z } from "zod";
import { createRouter } from "../lib/create-app";
import { createRoute } from "@hono/zod-openapi";

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
                  description: z.string().nullable(),
                  coverImageUrl: z.string().nullable(),
                  isPublic: z.boolean().nullable(),
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
          description: true,
          coverImageUrl: true,
          isPublic: true,
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
                  description: z.string().nullable(),
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
        },
      });

      return c.json(res, 200);
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

      const res: { id: number }[] = await db
        .insert(userBooks)
        .values({
          userId: dbUser.id,
          title: title,
          description: description,
          slug: slug,
          isPublic: isPublic,
        })
        .returning({ id: userBooks.id });

      c.executionCtx.waitUntil(
        new Promise(async (resolve) => {
          try {
            const coverImageFormData = formData.get("coverImage") as File;
            let coverImageUrl;

            if (coverImageFormData && coverImageFormData.size > 0) {
              try {
                const buffer = await coverImageFormData?.arrayBuffer();
                const fileExtension = coverImageFormData?.type.split("/")[1];
                const key = `${nanoid()}.${fileExtension}`;
                await c.env.litarchive.put(key, buffer);
                coverImageUrl = `https://pub-e94a2a2980874e3ab621fd44043e7eca.r2.dev/${key}`;
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

                  coverImageUrl = `https://pub-e94a2a2980874e3ab621fd44043e7eca.r2.dev/${key}`;
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
  );

export default communityBooks;
