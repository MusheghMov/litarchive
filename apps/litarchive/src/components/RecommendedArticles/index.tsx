import honoClient from "@/app/honoRPCClient";
import { Article, Book } from "@/types";
import { auth } from "@clerk/nextjs/server";
import { MoveRight } from "lucide-react";
import ArticleCard from "../ArticleCard";
import Link from "next/link";

export default async function RecommendedBooks() {
  const { userId } = await auth();
  let articles: Article[] = [];

  try {
    const res = await honoClient.articles.$get({
      query: { limit: "2", sort: "desc" },
    });

    if (!res.ok) {
      console.error("error: ", res);
      return null;
    }
    articles = await res.json();
  } catch (e) {
    console.error("error", e);
  }

  return (
    <div className="flex w-full flex-col gap-3">
      <Link
        href="/articles"
        className="flex w-fit flex-row gap-2 capitalize hover:underline"
      >
        <span>more articles</span>
        <MoveRight />
      </Link>
      <div className="grid w-full flex-1 auto-rows-max place-items-center gap-4 lg:grid-cols-2">
        {articles?.map((article) => {
          return <ArticleCard article={article} key={article.id} />;
        })}
      </div>
    </div>
  );
}
