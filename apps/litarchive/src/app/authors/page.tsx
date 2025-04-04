import honoClient from "../honoRPCClient";
import Authors from "./Authors";
import { cache } from "react";

const cachedGetAauthors = cache(async () => {
  return await honoClient.authors.$get({
    query: {
      search: "",
    },
  });
});

export default async function AuthorsPage() {
  const res = await cachedGetAauthors()

  if (!res.ok) {
    console.error("error: ", res);
    return null;
  }

  const authors = await res.json();

  return (
    <div className="flex w-full max-w-[1000px] flex-col items-start justify-between gap-2 self-center px-4 py-10 sm:p-10 lg:px-0">
      <Authors authors={authors} />
    </div>
  );
}
