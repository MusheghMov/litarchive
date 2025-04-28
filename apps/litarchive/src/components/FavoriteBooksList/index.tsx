import { auth } from "@clerk/nextjs/server";
import BookCard from "../BookCard";
import honoClient from "@/app/honoRPCClient";

export default async function FavoriteBooksList() {
  const { userId } = await auth();
  let favoriteBooks;

  try {
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
    <div className="flex flex-col space-y-4">
      <p className="font-bold capitalize">favorite books</p>
      <div className="grid w-full grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5">
        {favoriteBooks?.map((book: any) => (
          <BookCard key={book.book.id} book={book.book} isLiked={true} />
        ))}
      </div>
    </div>
  );
}
