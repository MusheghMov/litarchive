import BookCard from "@/components/BookCard";
import { auth } from "@clerk/nextjs/server";
import honoClient from "@/app/honoRPCClient";
import AuthorCard from "@/components/AuthorCard";
import ListCard from "@/components/ListCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default async function ProfilePage() {
  const { userId } = await auth();
  let favoriteBooks;
  let ratedAuthors;
  let lists;
  try {
    const listsJson = await honoClient.lists.$get(
      {
        query: {
          limit: "3",
        },
      },
      {
        headers: { Authorization: `${userId}` },
      }
    );
    if (listsJson.ok) {
      lists = await listsJson.json();
    }
  } catch (error) {
    console.error("error", error);
  }
  try {
    const ratedAuthorsJson = await honoClient.authors["ratedAuthors"].$get(
      {},
      {
        headers: { Authorization: `${userId}` },
      }
    );
    if (ratedAuthorsJson.ok) {
      ratedAuthors = await ratedAuthorsJson.json();
    }
  } catch (error) {
    console.error("error", error);
  }

  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const favoriteBooksJson = await honoClient.books["favorites"].$post(
      {},
      {
        headers: { Authorization: `${userId}` },
      }
    );
    if (favoriteBooksJson.ok) {
      favoriteBooks = await favoriteBooksJson.json();
    }
  } catch (error) {
    console.error("error", error);
  }

  return (
    <div className="flex w-full flex-col gap-6 px-4 md:px-8 lg:max-w-[1000px] lg:p-0">
      {lists && lists.length > 0 && (
        <div className="flex w-full flex-col gap-y-4">
          <div className="flex w-full items-center justify-between gap-4">
            <div className="flex w-fit items-center gap-2">
              <p className="font-bold capitalize">your lists</p>
              <p className="bg-primary/40 flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold">
                {lists?.length}
              </p>
            </div>
            <Link href="/lists">
              <Button className="w-fit" variant="link">
                View All Lists
                <ArrowRight size={16} className="ml-1" />
              </Button>
            </Link>
          </div>
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {lists?.map((list) => <ListCard key={list.id} list={list} />)}
          </div>
        </div>
      )}
      <div className="flex w-full flex-col gap-y-4">
        <p className="font-bold capitalize">rated authors</p>
        <div className="grid w-full grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5">
          {ratedAuthors?.map((ratedAuthor) => (
            <AuthorCard
              key={ratedAuthor.id}
              author={ratedAuthor}
              userRating={ratedAuthor.userRating || 0}
              averageRating={ratedAuthor.averageRating || 0}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col space-y-4">
        <p className="font-bold capitalize">favorite books</p>
        <div className="grid w-full grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5">
          {favoriteBooks?.map((book: any) => (
            <BookCard key={book.book.id} book={book.book} isLiked={true} />
          ))}
        </div>
      </div>
    </div>
  );
}
