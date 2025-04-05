import honoClient from "@/app/honoRPCClient";
import RecommendationSection from "../RecommendationSection";
import { auth } from "@clerk/nextjs/server";
import { Book } from "@/types";

export default async function RecommendedBooks() {
  const { userId } = await auth();
  let recentlyAddedBooks: Book[] = [];
  let booksByAuthor: Book[] = [];

  try {
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
    recentlyAddedBooks = await recentlyAddedBooksJson.json();
  } catch (e) {
    console.error("error", e);
  }

  try {
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
    booksByAuthor = await booksByAuthorJson.json();
  } catch (e) {
    console.error("error", e);
  }

  return (
    <>
      {recentlyAddedBooks.length > 0 && (
        <RecommendationSection
          books={recentlyAddedBooks}
          title="recently added books"
          href="/books"
        />
      )}

      {booksByAuthor.length > 0 && (
        <RecommendationSection
          books={booksByAuthor}
          title={`books by ${booksByAuthor[0]?.author?.name}`}
          href={`/authors/${booksByAuthor[0]?.author?.slug}`}
        />
      )}
    </>
  );
}
