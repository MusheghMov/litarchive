"use client";

import { AspectRatio } from "../ui/aspect-ratio";
import { BookImage } from "lucide-react";
import { forwardRef } from "react";
import { useRouter } from "next/navigation";
import FavoriteButton from "../FavoriteButton";
import { Progress } from "../ui/progress";
import AddToList from "../AddToList";

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
      className="group border-foreground/20 bg-card-foreground/5 hover:border-primary/60 relative flex !h-min w-full cursor-pointer flex-col space-y-1 justify-self-center overflow-hidden rounded-md border"
      ref={ref}
      onClick={() => {
        if (!book?.userReadingProgress) {
          router.push(`/books/${book.id}?page=${1}`);
        } else {
          return router.push(
            `/books/${book.id}?page=${book?.userReadingProgress[0]?.lastPageNumber || 1}`
          );
        }
      }}
    >
      <AspectRatio
        ratio={5 / 4}
        className="relative flex items-center justify-center"
      >
        <BookImage
          size={100}
          strokeWidth={0.5}
          className="stroke-foreground/40 transition-all group-hover:scale-125"
        />
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          <FavoriteButton
            bookId={book.id}
            isLiked={isLiked}
            key={isLiked?.toString()}
          />
          <AddToList bookId={book.id} />
        </div>
      </AspectRatio>

      <div className="flex w-full flex-col items-start justify-between gap-3 px-2 pb-2">
        <div className="flex w-full flex-row items-center justify-between gap-2">
          <div className="flex min-w-0 flex-col items-start justify-center">
            <p className="line-clamp-1 text-sm font-bold uppercase">
              {book.title}
            </p>
            <p className="line-clamp-1 text-sm font-light text-gray-400 uppercase">
              {book.titleTranslit}
            </p>
          </div>
        </div>

        <p className="line-clamp-1 text-sm font-bold uppercase">
          {book?.author?.name || "Author"}
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
