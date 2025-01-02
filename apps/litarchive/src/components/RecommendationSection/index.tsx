import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
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
        className="flex w-fit flex-row space-x-2 hover:underline lg:pl-16"
      >
        <span>{title}</span>
        <MoveRight />
      </Link>
      <Carousel className="w-full lg:px-20">
        <CarouselContent className="-ml-1 flex h-min">
          {books.map((book: any) => (
            <CarouselItem
              key={book.id}
              className="flex basis-1/2 justify-center p-2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
            >
              <BookCard
                book={book}
                isLiked={book?.userLikedBooks?.length > 0}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
    </div>
  );
}
