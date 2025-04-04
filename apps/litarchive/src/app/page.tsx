import Hero from "@/components/Hero";
import RecommendationSection from "@/components/RecommendationSection";
import { auth } from "@clerk/nextjs/server";
import honoClient from "./honoRPCClient";
import ArticleCard from "@/components/ArticleCard";
import { Article } from "@/types";
import { MoveRight } from "lucide-react";
import { title } from "process";
import Link from "next/link";

export default async function Home() {
  const { userId } = await auth();
  let articles: Article[] = [];
  const recentlyAddedBooksJson = await honoClient.books.$get(
    {
      query: {
        limit: "4",
      },
    },
    {
      headers: { Authorization: `${userId}` },
    }
  );
  const recentlyAddedBooks = await recentlyAddedBooksJson.json();
  const booksByAuthorJson = await honoClient.books.$get(
    {
      query: {
        authorId: "37",
        limit: "4",
      },
    },
    {
      headers: { Authorization: `${userId}` },
    }
  );
  const booksByAuthor = await booksByAuthorJson.json();

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
    <div className="relative flex h-max w-full flex-col md:mt-8">
      <Hero />
      <div className="flex w-full max-w-[1200px] flex-col space-y-10 self-center px-4 py-10 lg:px-10">
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
        <RecommendationSection
          books={recentlyAddedBooks}
          title="recently added books"
          href="/books"
        />
        <RecommendationSection
          books={booksByAuthor}
          title={`books by ${booksByAuthor[0]?.author?.name}`}
          href={`/authors/${booksByAuthor[0]?.author?.slug}`}
        />
      </div>
    </div>
  );
}
