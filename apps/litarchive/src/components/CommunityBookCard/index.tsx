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

export default function CommunityBookCard({ book }: { book: CommunityBook }) {
  return (
    <Link href={`/community/${book.slug}`}>
      <Card
        key={book.id}
        className="flex aspect-[2/3] w-full flex-col justify-end overflow-hidden rounded border p-2"
      >
        <div className="flex h-full flex-col gap-2 overflow-hidden">
          <CardContent className="aspect-square overflow-hidden rounded p-0">
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
