import { auth } from "@clerk/nextjs/server";
import honoClient from "../honoRPCClient";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import CommunityBookCard from "@/components/CommunityBookCard";
import { CommunityBook } from "@/types";

export default async function StudioPage() {
  const { userId } = await auth();
  let userBooks;
  try {
    const userBooksJson = await honoClient.community.books.$get(
      {},
      {
        headers: { Authorization: `${userId}` },
      }
    );

    if (userBooksJson.ok) {
      userBooks = await userBooksJson.json();
    }
  } catch (error) {
    console.error("Error fetching user books:", error);
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <Button className="text-background w-fit cursor-pointer self-end">
        <Link href="/studio/create">Create book</Link>
      </Button>
      {userBooks && !userBooks.length ? (
        <div className="flex h-full w-full items-center justify-center">
          No books found
        </div>
      ) : (
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
      )}
    </div>
  );
}
