import honoClient from "@/app/honoRPCClient";
import AuthorCard from "../AuthorCard";
import { auth } from "@clerk/nextjs/server";

export default async function RatedAuthorsList() {
  const { userId } = await auth();

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
  return (
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
  );
}
