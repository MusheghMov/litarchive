import BookCard from "@/components/BookCard";
import { auth } from "@clerk/nextjs/server";
import honoClient from "@/app/honoRPCClient";
import AuthorCard from "@/components/AuthorCard";

export default async function ProfilePage() {
  const { userId } = await auth();
  let favoriteBooks;
  let ratedAuthors;
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
    <div className="mt-8 flex w-full flex-col items-start justify-between space-y-10 self-center px-4 md:px-8 lg:mt-14 lg:max-w-[80%] lg:p-0">
      <div className="flex w-full flex-col gap-y-4">
        <p className="font-bold capitalize">rated authors</p>
        <div className="grid w-full grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
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
        <div className="grid w-full grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
          {favoriteBooks?.map((book: any) => (
            <BookCard key={book.book.id} book={book.book} isLiked={true} />
          ))}
        </div>
      </div>
    </div>
  );
}
