import { type InferSelectModel } from "drizzle-orm";
import { InferResponseType } from "hono";
import honoClient from "./app/honoRPCClient";

export type Author = InferResponseType<typeof honoClient.authors.$get>[0];
export type Article = InferResponseType<typeof honoClient.articles.$get>[0];
// export type Book = InferSelectModel<typeof books>;
// export type Author = InferSelectModel<typeof authors>;
// export type User = InferSelectModel<typeof user>;
// export type Article = InferSelectModel<typeof articles>;
