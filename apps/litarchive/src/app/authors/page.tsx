import honoClient from "../honoRPCClient";
import Authors from "./Authors";
import { cache } from "react";

const cachedGetAuthors = cache(async () => {
  return await honoClient.authors.$get({
    query: {
      search: "",
    },
  });
});

export default async function AuthorsPage() {
  const res = await cachedGetAuthors();
  if (!res.ok) {
    console.error("error: ", res);
    return null;
  }

  const authors = await res.json();

  return <Authors authors={authors} />;
}
