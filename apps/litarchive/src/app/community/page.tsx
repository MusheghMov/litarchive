import honoClient from "../honoRPCClient";
import CommunityBookCard from "@/components/CommunityBookCard";

export default async function CommunityPage() {
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
          <CommunityBookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}
