import { connectToDB, like, eq, sql } from "@repo/db";
import { z, createRoute } from "@hono/zod-openapi";
import { createRouter } from "../lib/create-app";
import { authorRatings, authors } from "@repo/db/schema";

const router = createRouter();

const authorsRoute = router
  .openapi(
    createRoute({
      method: "get",
      path: "/",
      request: {
        query: z.object({
          search: z.string().optional(),
        }),
      },
      responses: {
        200: {
          content: {
            "application/json": {
              schema: z.array(
                z.object({
                  name: z.string().nullable(),
                  id: z.number(),
                  imageUrl: z.string().nullable(),
                  color: z.string().nullable(),
                  bio: z.string().nullable(),
                  birthDate: z.string().nullable(),
                  deathDate: z.string().nullable(),
                  averageRating: z.number().nullable(),
                }),
              ),
            },
          },
          description: "Retrive authors",
        },
      },
    }),
    async (c) => {
      const search = c.req.query("search") || "";
      const db = connectToDB({
        url: c.env.DATABASE_URL,
        authoToken: c.env.DATABASE_AUTH_TOKEN,
      });
      const authorsWithRatings = await db
        .select({
          id: authors.id,
          name: authors.name,
          imageUrl: authors.imageUrl,
          color: authors.color,
          bio: authors.bio,
          birthDate: authors.birthDate,
          deathDate: authors.deathDate,
          averageRating: sql<number>`COALESCE(AVG(${authorRatings.rating}), 0)`,
        })
        .from(authors)
        .leftJoin(authorRatings, eq(authors.id, authorRatings.authorId))
        .where(like(authors.name, `%${search}%`))
        .groupBy(
          authors.id,
          authors.name,
          authors.imageUrl,
          authors.color,
          authors.bio,
          authors.birthDate,
          authors.deathDate,
        );

      return c.json(authorsWithRatings);
    },
  )
  .openapi(
    createRoute({
      method: "get",
      path: "/ratedAuthors",
      responses: {
        200: {
          content: {
            "application/json": {
              schema: z.array(
                z.object({
                  id: z.number(),
                  name: z.string().nullable(),
                  imageUrl: z.string().nullable(),
                  color: z.string().nullable(),
                  bio: z.string().nullable(),
                  birthDate: z.string().nullable(),
                  deathDate: z.string().nullable(),
                  userRating: z.number().nullable(),
                  review: z.string().nullable(),
                  averageRating: z.number().nullable(),
                  totalRatings: z.number().nullable(),
                }),
              ),
            },
          },
          description: "Retrive authors rated by user",
        },
        401: {
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
      const user = await db.query.user.findFirst({
        where: (users, { eq }) => eq(users.sub, userId),
      });
      if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      const ratedAuthors = await db
        .select({
          // Author details
          id: authors.id,
          name: authors.name,
          imageUrl: authors.imageUrl,
          color: authors.color,
          bio: authors.bio,
          birthDate: authors.birthDate,
          deathDate: authors.deathDate,
          userRating: authorRatings.rating,
          review: authorRatings.review,
          averageRating: sql<number>`(
          SELECT AVG(ar2.rating) 
          FROM ${authorRatings} ar2 
          WHERE ar2.author_id = ${authors.id}
        )`,
          totalRatings: sql<number>`(
          SELECT COUNT(*) 
          FROM ${authorRatings} ar2 
          WHERE ar2.author_id = ${authors.id}
        )`,
        })
        .from(authorRatings)
        .innerJoin(authors, eq(authorRatings.authorId, authors.id))
        .where(eq(authorRatings.userId, user.id));

      return c.json(ratedAuthors);
    },
  )
  .openapi(
    createRoute({
      method: "get",
      path: "/:authorId",
      request: {
        params: z.object({
          authorId: z.string(),
        }),
      },
      responses: {
        200: {
          content: {
            "application/json": {
              schema: z.object({
                name: z.string().nullable(),
                id: z.number(),
                imageUrl: z.string().nullable(),
                color: z.string().nullable(),
                bio: z.string().nullable(),
                birthDate: z.string().nullable(),
                deathDate: z.string().nullable(),
                averageRating: z.number().nullable(),
                ratingsCount: z.number(),
                reviewsCount: z.number(),
                userRating: z.number().nullable(),
                userReview: z.string().nullable(),
                ratings: z.array(
                  z.object({
                    id: z.number(),
                    userId: z.number(),
                    authorId: z.number(),
                    rating: z.number(),
                    review: z.string().nullable(),
                    createdAt: z.string().nullable(),
                    updatedAt: z.string().nullable(),
                    user: z.object({
                      sub: z.string(),
                      firstName: z.string(),
                      lastName: z.string(),
                      email: z.string(),
                      imageUrl: z.string(),
                    }),
                  }),
                ),
              }),
            },
          },
          description: "Retrieve author",
        },
      },
    }),
    async (c: any) => {
      const authorId = +c.req.param("authorId");
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

      // Query the author with average rating
      const result = await db.query.authors.findMany({
        where: (authors, { eq }) => eq(authors.id, authorId),
        extras: {
          averageRating: sql<number | null>`
            (SELECT AVG(${authorRatings.rating})
             FROM ${authorRatings}
             WHERE ${authorRatings.authorId} = ${authorId})
          `.as("averageRating"),
          ratingsCount:
            sql<number>`(SELECT COUNT(*) FROM ${authorRatings} WHERE ${authorRatings.authorId} = ${authorId})`.as(
              "ratingsCount",
            ),
          reviewsCount:
            sql<number>`(SELECT COUNT(*) FROM ${authorRatings} WHERE ${authorRatings.authorId} = ${authorId} AND ${authorRatings.review} IS NOT NULL AND ${authorRatings.review} != "")`.as(
              "ratingsCount",
            ),
          ...(dbUser
            ? {
                userRating:
                  sql<number>`(SELECT ${authorRatings.rating} FROM ${authorRatings} WHERE ${authorRatings.authorId} = ${authorId} AND ${authorRatings.userId} = ${dbUser?.id})`.as(
                    "userRating",
                  ),
                userReview:
                  sql<string>`(SELECT ${authorRatings.review} FROM ${authorRatings} WHERE ${authorRatings.authorId} = ${authorId} AND ${authorRatings.userId} = ${dbUser?.id})`.as(
                    "userReview",
                  ),
              }
            : {}),
          //         ratingInfo: sql`(
          //   SELECT json_object(
          //     'createdAt', ${authorRatings.createdAt},
          //     'id', ${authorRatings.id}
          //   )
          //   FROM ${authorRatings}
          //   WHERE ${authorRatings.authorId} = ${authorId}
          //   AND ${authorRatings.userId} = ${dbUser?.id}
          //   LIMIT 1
          // )`.as("ratingInfo"),
        },
        with: {
          ratings: {
            columns: {
              userId: true,
              authorId: true,
              rating: true,
              review: true,
              createdAt: true,
              updatedAt: true,
            },
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
            },
          },
        },
      });

      if (result.length === 0) {
        return c.json({ error: "Author not found" }, 404);
      }

      // Transform the author data
      const author = result[0];

      return c.json(author);
    },
  );

export default authorsRoute;
