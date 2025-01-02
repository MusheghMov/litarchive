import AuthorCard from "@/components/AuthorCard";
import { Input } from "@/components/ui/input";
import honoClient from "../honoRPCClient";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { InferResponseType } from "hono";
export type AuthorType = InferResponseType<typeof honoClient.authors.$get>[0];

export default async function AuthorsPage({
  searchParams,
}: {
  searchParams: Promise<{ search: string }>;
}) {
  const { search } = await searchParams;

  const res = await honoClient.authors.$get({
    query: {
      search: search || "",
    },
  });
  if (!res.ok) {
    console.error("error: ", res);
    return null;
  }

  const authors = await res.json();

  return (
    <div className="flex w-full flex-col items-start justify-between gap-2 px-28 py-10">
      <form
        action={async (formData) => {
          "use server";
          let search = "";
          try {
            search = formData?.get("search")?.toString() || "";
          } catch (err) {
            console.log("error: ", err as string);
          }
          if (search.length === 0) {
            redirect(`/authors`);
          } else {
            redirect(`/authors?search=${search as string}`);
          }
        }}
        className="flex gap-2"
      >
        <Input
          name="search"
          className="w-full sm:w-[400px]"
          placeholder="author name"
        />
        <Button>search</Button>
      </form>
      <div className="grid w-full grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
        {authors?.map((author) => (
          <AuthorCard key={author.id} author={author} />
        ))}
      </div>
    </div>
  );
}
