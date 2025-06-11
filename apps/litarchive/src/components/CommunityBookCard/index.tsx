import Image from "next/image";
import { ImageIcon } from "lucide-react";
import TooltipContainer from "@/components/TooltipContainer";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CommunityBook } from "@/types";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { Genre } from "@/types";
import { cn } from "@/lib/utils";

export default function CommunityBookCard({
  book,
  genres,
  role,
}: {
  book: CommunityBook;
  genres: Genre[] | undefined;
  role?: "editor" | "viewer";
}) {
  return (
    <Link href={`/books/${book.slug}`}>
      <Card
        key={book.id}
        className="flex aspect-[2/3] w-full flex-col justify-end gap-2 overflow-hidden rounded border p-2"
      >
        <div className="flex h-full flex-col gap-2 overflow-hidden">
          <CardContent className="relative aspect-square overflow-hidden rounded p-0">
            {role && (
              <Badge
                variant="outline"
                className={cn(
                  "absolute top-1 right-1 bg-yellow-600 text-xs",
                  role === "editor" && "bg-green-500"
                )}
              >
                {role}
              </Badge>
            )}
            {book.coverImageUrl ? (
              <Image
                src={book.coverImageUrl}
                alt="Cover Image"
                className="aspect-square h-full w-full object-cover"
                width={300}
                height={300}
              />
            ) : (
              <ImageIcon
                className="h-full w-full object-cover"
                strokeWidth={1}
              />
            )}
          </CardContent>
          <CardHeader className="px-3 py-0">
            <TooltipContainer tooltipContent={book.title}>
              <CardTitle className="line-clamp-2 text-base">
                {book.title}
              </CardTitle>
            </TooltipContainer>

            {genres && genres.length > 0 && (
              <div className="flex flex-row items-center gap-2">
                {genres.map((genre, index) =>
                  index > 0 ? (
                    <TooltipContainer
                      key={genre.id}
                      tooltipContent={
                        <div className="flex flex-row items-center gap-2">
                          {genres.map((genre) => (
                            <Badge
                              key={genre.id}
                              variant="outline"
                              className="text-xs"
                            >
                              {genre.name}
                            </Badge>
                          ))}
                        </div>
                      }
                    >
                      <Badge
                        key={genre.id}
                        variant="outline"
                        className="text-xs"
                      >
                        + {genres.length - index} more
                      </Badge>
                    </TooltipContainer>
                  ) : (
                    <Badge key={genre.id} variant="outline" className="text-xs">
                      {genre.name}
                    </Badge>
                  )
                )}
              </div>
            )}

            <TooltipContainer tooltipContent={book.description || ""}>
              <CardDescription className="line-clamp-2">
                {book.description}
              </CardDescription>
            </TooltipContainer>
          </CardHeader>
        </div>
        <CardFooter className="flex w-full items-center justify-between gap-4 p-0">
          <Badge variant="outline" className="text-xs">
            {book.isPublic ? "Public" : "Private"}
          </Badge>
          {book?.user && (
            <div className="flex flex-row items-center gap-2">
              <p className="text-xs">
                by:{" "}
                {book.user?.firstName?.charAt(0) +
                  "." +
                  " " +
                  book.user?.lastName}
              </p>
              <Avatar className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full border">
                <AvatarImage
                  src={book.user?.imageUrl || ""}
                  alt={book.user?.firstName || ""}
                />
                <AvatarFallback>
                  {`${book?.user?.firstName?.charAt(0) || "U"}`}
                </AvatarFallback>
              </Avatar>
            </div>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
