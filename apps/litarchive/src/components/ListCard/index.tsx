import { ListItem } from "@/types";
import Link from "next/link";

export default function ListCard({ list }: { list: ListItem }) {
  return (
    <Link
      className="group flex h-full w-full cursor-pointer flex-col justify-between gap-2"
      href={`/lists/${list.id}`}
    >
      <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-4 rounded border p-4 group-hover:border-primary/40">
        {list.booksToLists?.map((book) => (
          <div key={book.book.id} className="rounded-lg bg-primary/10 p-4">
            <p className="text-sm font-bold">{book.book.title}</p>
            <p className="text-xs">{book.book.authorName}</p>
          </div>
        ))}
        {list.bookCount - 3 > 0 && (
          <div className="flex items-center justify-center rounded-lg bg-primary/10 p-4">
            <p className="text-sm font-bold">
              {list.bookCount - 3} more{" "}
              {list.bookCount - 3 > 1 ? "books" : "book"}
            </p>
          </div>
        )}
      </div>
      <p className="text-sm font-bold">{list.name}</p>
    </Link>
  );
}
