import honoClient from "@/app/honoRPCClient";
import CommunityBookCard from "@/components/CommunityBookCard";
import { CommunityBook } from "@/types";
import { MoveRight } from "lucide-react";
import Link from "next/link";

export default async function RecommendedBooks() {
  let communityBooks;

  try {
    const communityBooksJson = await honoClient.community.books["public"].$get();
    if (communityBooksJson.ok) {
      communityBooks = await communityBooksJson.json();
      // Limit to first 8 books for homepage
      communityBooks = communityBooks.slice(0, 8);
    }
  } catch (error) {
    console.error("Error fetching community books:", error);
  }

  if (!communityBooks || communityBooks.length === 0) {
    return null;
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Community Creations</h2>
        <Link
          href="/books"
          className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          View all books
          <MoveRight className="h-4 w-4" />
        </Link>
      </div>
      
      <p className="text-muted-foreground">
        Discover amazing stories written by our community of creators
      </p>

      <div className="grid w-full grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {communityBooks.map((book) => (
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
