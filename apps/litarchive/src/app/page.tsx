import Hero from "@/components/Hero";
import RecommendationSection from "@/components/RecommendationSection";
import { auth } from "@clerk/nextjs/server";
import honoClient from "./honoRPCClient";

export default async function Home() {
  const { userId } = await auth();
  const recentlyAddedBooksJson = await honoClient.books.$get(
    {
      query: {
        limit: "10",
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
        limit: "10",
      },
    },
    {
      headers: { Authorization: `${userId}` },
    }
  );
  const booksByAuthor = await booksByAuthorJson.json();

  return (
    <div className="relative flex h-max w-full flex-col md:mt-8">
      <Hero />
      <div className="flex w-full flex-col space-y-10 px-4 py-10 lg:px-10">
        <RecommendationSection
          books={recentlyAddedBooks}
          title="recently added books"
          href="/books"
        />
        <RecommendationSection
          books={booksByAuthor}
          title={`books by ${booksByAuthor[0]?.author?.name}`}
          href={`/authors/${booksByAuthor[0]?.author?.id}`}
        />
      </div>
    </div>
  );
}
