import CommunityBookCard from "../CommunityBookCard";
import { MoveRight } from "lucide-react";
import Link from "next/link";
import { CommunityBook } from "@/types";

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
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight capitalize">{title}</h2>
        <Link
          href={href || ""}
          className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          View all
          <MoveRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid w-full grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {books.map((book: any) => (
          <CommunityBookCard
            key={book.id}
            book={book as CommunityBook}
            genres={book.genres?.map((genre: any) => genre.genre) || []}
          />
        ))}
      </div>
    </div>
  );
}
