import ArticleCard from "@/components/ArticleCard";
import honoClient from "../honoRPCClient";
import { cache } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const cachedGetArticles = cache(async (search: string) => {
  return await honoClient.articles.$get({
    query: {
      search: search || "",
    },
  });
});

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ search: string }>;
}) {
  const { search } = await searchParams;
  const res = await cachedGetArticles(search);

  if (!res.ok) {
    console.error("error: ", res);
    return null;
  }

  const articles = await res.json();

  return (
    <>
      <Link className="w-full" href="/articles/new">
        <Button variant="outline" className="cursor-pointer">
          Create Article
        </Button>
      </Link>

      <div className="grid w-full flex-1 auto-rows-max place-items-center gap-4 lg:grid-cols-2">
        {articles.map((article) => {
          return <ArticleCard article={article} key={article.id} />;
        })}
      </div>
    </>
  );
}
