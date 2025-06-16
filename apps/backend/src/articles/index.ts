import { createRoute, z } from "@hono/zod-openapi";
import { connectToDB } from "@repo/db";
import { createRouter } from "../lib/create-app";
// import { cache } from "hono/cache";

const router = createRouter();

// router.use(
//   cache({
//     cacheName: "articles",
//     cacheControl: "max-age=3600",
//   }),
// );

const articlesRoute = router
	.openapi(
		createRoute({
			method: "get",
			path: "/",
			request: {
				query: z.object({
					search: z.string().optional(),
					limit: z.string().optional(),
					sort: z.union([z.literal("asc"), z.literal("desc")]).optional(),
				}),
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: z.array(
								z.object({
									tags: z.string().nullable(),
									description: z.string().nullable(),
									title: z.string(),
									status: z.string().nullable(),
									content: z.string(),
									id: z.number(),
									imageUrl: z.string().nullable(),
									// userId: z.number(),
									createdAt: z.string().nullable(),
									updatedAt: z.string().nullable(),
									slug: z.string().nullable(),
								}),
							),
						},
					},
					description: "Retrive articles",
				},
			},
		}),
		async (c) => {
			const search = c.req.query("search") || "";
			const sort = c.req.query("sort") || "desc";
			const limit = Number.parseInt(c.req.query("limit")!) || 10;
			const userId = c.req.header("Authorization");
			const isAuthenticated = !!userId;

			const db = connectToDB({
				url: c.env.DATABASE_URL,
				authoToken: c.env.DATABASE_AUTH_TOKEN,
			});
			const res = await db.query.articles.findMany({
				where: (articles, { and, eq, like }) =>
					and(
						like(articles.title, `%${search}%`),
						eq(articles.status, "published"),
					),
				orderBy: (articles, { desc, asc }) =>
					sort === "asc" ? asc(articles.id) : desc(articles.id),
				limit: limit,
			});
			const articlesWithoutUserId = res.map(({ userId, ...rest }) => rest);
			if (isAuthenticated) {
				return c.json(res);
			}
			return c.json(articlesWithoutUserId);
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
								tags: z.string().nullable(),
								description: z.string().nullable(),
								title: z.string(),
								status: z.string().nullable(),
								content: z.string(),
								id: z.number(),
								imageUrl: z.string().nullable(),
								// userId: z.number(),
								createdAt: z.string().nullable(),
								updatedAt: z.string().nullable(),
								slug: z.string().nullable(),
							}),
						},
					},
					description: "Retrive article",
				},
			},
		}),
		async (c) => {
			const slug = c.req.param("slug");
			const userId = c.req.header("Authorization");
			const isAuthenticated = !!userId;
			const db = connectToDB({
				url: c.env.DATABASE_URL,
				authoToken: c.env.DATABASE_AUTH_TOKEN,
			});
			const res = await db.query.articles.findMany({
				limit: 1,
				where: (articles, { eq }) => eq(articles.slug, slug),
			});
			const articlesWithoutUserId = res.map(({ userId, ...rest }) => rest);
			if (isAuthenticated) {
				return c.json(res[0]);
			}
			return c.json(articlesWithoutUserId[0]);
		},
	);

export default articlesRoute;
