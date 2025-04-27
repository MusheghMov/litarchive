import { createRoute, z } from "@hono/zod-openapi";
import { zValidator } from "@hono/zod-validator";
import { connectToDB, eq } from "@repo/db";
import { createRouter } from "../lib/create-app";
import { user } from "@repo/db/schema";

const router = createRouter();

const userApp = router
  .openapi(
    createRoute({
      method: "delete",
      path: "/",
      responses: {
        200: {
          content: {
            "application/json": {
              schema: z.object({
                message: z.string(),
                success: z.boolean(),
              }),
            },
          },
          description: "User and all associated data successfully deleted",
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
          description: "User not found",
        },
        500: {
          content: {
            "application/json": {
              schema: z.object({
                error: z.string(),
              }),
            },
          },
          description: "Server error",
        },
      },
    }),
    async (c) => {
      try {
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
          return c.json({ error: "User not found" }, 404);
        }

        await db.delete(user).where(eq(user.id, dbUser.id));

        return c.json({
          message: "User account and all associated data successfully deleted",
          success: true,
          error: "false",
        });
      } catch (error) {
        console.error("Error deleting user:", error);
        return c.json(
          {
            error: "Failed to delete user account. Please try again later.",
          },
          500,
        );
      }
    },
  )
  .post(
    "/create",
    zValidator(
      "query",
      z.object({
        sub: z.string(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        email: z.string().optional(),
        imageUrl: z.string().optional(),
      }),
    ),
    async (c) => {
      const db = connectToDB({
        url: c.env.DATABASE_URL,
        authoToken: c.env.DATABASE_AUTH_TOKEN,
      });
      const sub = c.req.query("sub");
      const firstName = c.req.query("firstName");
      const lastName = c.req.query("lastName");
      const email = c.req.query("email");
      const imageUrl = c.req.query("imageUrl");

      if (!sub) {
        return c.json({ error: "Sub is required" }, 400);
      }

      const res = await db.insert(user).values({
        sub: c.req.query("sub"),
        ...(firstName && { firstName: firstName }),
        ...(lastName && { lastName: lastName }),
        ...(email && { email: email }),
        ...(imageUrl && { imageUrl: imageUrl }),
      });
      return c.json(res);
    },
  );

export default userApp;
