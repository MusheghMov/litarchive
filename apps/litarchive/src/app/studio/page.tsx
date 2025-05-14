import { auth } from "@clerk/nextjs/server";
import honoClient from "../honoRPCClient";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import CommunityBookCard from "@/components/CommunityBookCard";
import { CommunityBook } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export default async function StudioPage() {
  const { getToken } = await auth();
  let userBooks;
  let sharedWithMeBooks;
  try {
    const token = await getToken();
    const userBooksJson = await honoClient.community.books.$get(
      {},
      {
        headers: { ...(token && { Authorization: token }) },
      }
    );

    if (userBooksJson.ok) {
      userBooks = await userBooksJson.json();
    }
  } catch (error) {
    console.error("Error fetching user books:", error);
  }
  try {
    const token = await getToken();
    const userBooksJson = await honoClient.community.books[
      "shared-with-me"
    ].$get(
      {},
      {
        headers: { ...(token && { Authorization: token }) },
      }
    );

    if (userBooksJson.ok) {
      sharedWithMeBooks = await userBooksJson.json();
    }
  } catch (error) {
    console.error("Error fetching user books:", error);
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <Button className="text-background w-fit cursor-pointer self-end">
        <Link href="/studio/create">Create book</Link>
      </Button>

      <Tabs defaultValue="books" className="w-full">
        <TabsList className="bg-background">
          <TabsTrigger value="books" asChild>
            <Button
              variant="link"
              className="text-muted-foreground data-[state=active]:shadow-none"
            >
              My books
            </Button>
          </TabsTrigger>
          <Separator orientation="vertical" />
          <TabsTrigger value="reviews" asChild>
            <Button
              variant="link"
              className="text-muted-foreground data-[state=active]:shadow-none"
            >
              Shared with me
            </Button>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="books" className="mt-4">
          {userBooks && !userBooks.length ? (
            <div className="flex h-full w-full items-center justify-center">
              You have no books
            </div>
          ) : (
            <div className="grid w-full grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {userBooks?.map((book) => (
                <CommunityBookCard
                  key={book.id}
                  book={book as CommunityBook}
                  genres={book.genres.map((genre) => genre.genre)}
                />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="reviews" className="mt-4 flex flex-col gap-6">
          {sharedWithMeBooks && !sharedWithMeBooks.length ? (
            <div className="flex h-full w-full items-center justify-center">
              No shared books found
            </div>
          ) : (
            <div className="grid w-full grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {sharedWithMeBooks?.map((sharedBook) => (
                <CommunityBookCard
                  key={sharedBook?.userBook?.id}
                  book={sharedBook?.userBook as CommunityBook}
                  genres={sharedBook?.userBook?.genres.map(
                    (genre) => genre.genre
                  )}
                  role={sharedBook?.role}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
