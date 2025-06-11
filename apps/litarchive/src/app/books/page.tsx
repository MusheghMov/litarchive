import { Metadata } from "next";
import honoClient from "../honoRPCClient";
import CommunityBookCard from "@/components/CommunityBookCard";
import { CommunityBook } from "@/types";

export const metadata: Metadata = {
  title: "Community Books - Discover Stories by Independent Creators",
  description: "Browse our collection of community-created books and stories. Discover new voices, genres, and narratives from talented writers worldwide. Read, rate, and support independent authors.",
  keywords: [
    "community books",
    "independent authors",
    "self-published books",
    "user-generated stories",
    "indie literature",
    "collaborative storytelling",
    "digital books",
    "online reading"
  ],
  openGraph: {
    title: "Community Books - Discover Stories by Independent Creators",
    description: "Browse our collection of community-created books and stories. Discover new voices, genres, and narratives from talented writers worldwide.",
    url: "https://litarchive.com/books",
    type: "website",
  },
  twitter: {
    title: "Community Books - Discover Stories by Independent Creators",
    description: "Browse our collection of community-created books and stories from talented writers worldwide."
  },
  alternates: {
    canonical: "/books",
  },
};

export default async function BooksPage() {
  let userBooks;
  try {
    const userBooksJson = await honoClient.community.books["public"].$get();

    if (userBooksJson.ok) {
      userBooks = await userBooksJson.json();
    }
  } catch (error) {
    console.error("Error fetching user books:", error);
  }

  if (userBooks && userBooks.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        No books found
      </div>
    );
  }

  return (
    <div className="grid w-full gap-4">
      <div className="grid w-full grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {userBooks?.map((book) => (
          <CommunityBookCard
            key={book.id}
            book={book as CommunityBook}
            genres={book.genres.map((genre) => genre.genre)}
          />
        ))}
      </div>
    </div>
  );
}
