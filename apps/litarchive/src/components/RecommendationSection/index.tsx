import BookCard from "../BookCard";
import { MoveRight } from "lucide-react";
import Link from "next/link";

export default function RecommendationSection({
  books,
  title,
  href,
}: {
  books: any;
  title: string;
  href: string;
}) {
  return (
    <div className="flex w-full flex-col gap-3">
      <Link
        href={href || ""}
        className="flex w-fit flex-row space-x-2 capitalize hover:underline"
      >
        <span>{title}</span>
        <MoveRight />
      </Link>

      <div className="grid w-full grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {books.map((book: any) => (
          <BookCard
            key={book.id}
            book={book}
            isLiked={book?.userLikedBooks?.length > 0}
          />
        ))}
      </div>
    </div>
  );
}
