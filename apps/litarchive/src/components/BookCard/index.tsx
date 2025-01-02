"use client";

import { AspectRatio } from "../ui/aspect-ratio";
import { BookImage } from "lucide-react";
import { forwardRef } from "react";
import { useRouter } from "next/navigation";
import FavoriteButton from "../FavoriteButton";
import { Progress } from "../ui/progress";

export default forwardRef(function BookCard(
  {
    book,
    isLiked,
  }: {
    book: any;
    isLiked?: boolean;
  },
  ref: any
) {
  const router = useRouter();

  return (
    <div
      className="group relative flex !h-min w-full cursor-pointer flex-col space-y-1 justify-self-center overflow-hidden rounded-md border border-foreground/20 bg-card-foreground/5 hover:border-primary/60"
      ref={ref}
      onClick={() => {
        if (book?.userReadingProgress?.length === 0) {
          router.push(`/books/${book.id}?page=${1}`);
        } else {
          return router.push(
            `/books/${book.id}?page=${book?.userReadingProgress[0]?.lastPageNumber}`
          );
        }
      }}
    >
      <div className="overflow-hidden rounded">
        <AspectRatio
          ratio={5 / 4}
          className="relative flex items-center justify-center transition-all group-hover:scale-125"
        >
          <BookImage
            size={100}
            strokeWidth={0.5}
            className="stroke-foreground/40"
          />
        </AspectRatio>
      </div>

      <div className="flex w-full flex-col items-start justify-between gap-3 px-2 pb-2">
        <div className="flex w-full flex-row items-center justify-between gap-2">
          <div className="flex min-w-0 flex-col items-start justify-center">
            <p className="line-clamp-1 text-sm font-bold uppercase">
              {book.title}
            </p>
            <p className="line-clamp-1 text-sm font-light uppercase text-gray-400">
              {book.titleTranslit}
            </p>
          </div>
          <FavoriteButton
            bookId={book.id}
            isLiked={isLiked}
            key={isLiked?.toString()}
          />
        </div>

        <p className="line-clamp-1 text-sm font-bold uppercase">
          {book.author.name || "Author"}
        </p>
      </div>
      {book?.userReadingProgress?.length > 0 ? (
        <Progress
          className="absolute bottom-0 h-1 rounded-[0]"
          value={
            (book?.userReadingProgress[0]?.lastPageNumber /
              book.bookPagesCount) *
            100
          }
        />
      ) : null}
    </div>
  );
});
