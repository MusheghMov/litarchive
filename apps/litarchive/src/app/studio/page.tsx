import { auth } from "@clerk/nextjs/server";
import honoClient from "../honoRPCClient";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import TooltipContainer from "@/components/TooltipContainer";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function StudioPage() {
  const { userId } = await auth();
  let userBooks;
  try {
    const userBooksJson = await honoClient.community.books.$get(
      {},
      {
        headers: { Authorization: `${userId}` },
      }
    );

    if (userBooksJson.ok) {
      userBooks = await userBooksJson.json();
    }
  } catch (error) {
    console.error("Error fetching user books:", error);
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <Button className="text-background w-fit cursor-pointer self-end">
        <Link href="/studio/create">Create book</Link>
      </Button>
      {userBooks && !userBooks.length ? (
        <div className="flex h-full w-full items-center justify-center">
          No books found
        </div>
      ) : (
        <div className="grid w-full gap-4">
          <div className="grid w-full grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {userBooks?.map((book) => (
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
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
