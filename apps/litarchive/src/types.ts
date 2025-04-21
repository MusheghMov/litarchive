// import { type InferSelectModel } from "drizzle-orm";
import { InferResponseType } from "hono";
import honoClient from "./app/honoRPCClient";

export type Book = InferResponseType<typeof honoClient.books.$get>[0];

const getCommunityBookEndpoint = honoClient.community.books[":slug"].$get;
export type CommunityBook = Exclude<
  InferResponseType<typeof getCommunityBookEndpoint>,
  {} & { [key: string]: string }
>;

const getCommunityChaptersEndpoint =
  honoClient.community.chapters[":chapterId"].$get;
export type Chapter = Exclude<
  InferResponseType<typeof getCommunityChaptersEndpoint>,
  {} & { [key: string]: string }
>;

export type Author = InferResponseType<typeof honoClient.authors.$get>[0];
export type Article = InferResponseType<typeof honoClient.articles.$get>[0];
export type Genre = Exclude<
  InferResponseType<typeof honoClient.genres.$get>,
  {} & { [key: string]: string }
>[0];

export type Lists = Extract<
  InferResponseType<typeof honoClient.lists.$get>,
  Array<unknown>
>;
export type ListItem = Lists[number];
const getListEndpoint = honoClient.lists[":listId"].$get;
export type List = Exclude<
  InferResponseType<typeof getListEndpoint>,
  {} & { [key: string]: never }
>;

// export type Book = InferSelectModel<typeof books>;
// export type Author = InferSelectModel<typeof authors>;
// export type User = InferSelectModel<typeof user>;
// export type Article = InferSelectModel<typeof articles>;
