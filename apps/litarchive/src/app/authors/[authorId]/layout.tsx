import honoClient from "@/app/honoRPCClient";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { auth } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import { Rating as ReactRating, StickerStar } from "@smastrom/react-rating";

export default async function Layout({
  children,
  authorBooks,
  params,
}: {
  children: React.ReactNode;
  authorBooks: React.ReactNode;
  params: Promise<{ authorId: string }>;
}) {
  const { authorId } = await params;
  const { userId } = await auth();

  const res = await honoClient.authors[":authorId"].$get(
    {
      param: {
        authorId,
      },
    },
    {
      headers: { Authorization: `${userId}` },
    }
  );
  const author = await res.json();

  return (
    <div className="mt-0 flex w-full flex-col items-center justify-between p-3 sm:p-6 md:p-10 lg:mt-16">
      <div className="relative flex max-w-[1000px] flex-col gap-10 lg:flex-row">
        {children}
        <div className="flex w-fit flex-col gap-10">
          <div className="flex w-full flex-col gap-4 lg:overflow-hidden">
            <div className="grid gap-1">
              <div className="flex gap-4">
                <p className="text-4xl font-medium capitalize">
                  {author?.name}
                </p>
                <Separator orientation="vertical" />
                <div className="flex flex-col gap-2 md:flex-row">
                  <div className="flex gap-2">
                    <ReactRating
                      className="w-full"
                      style={{ width: "100%", maxWidth: "20px" }}
                      value={50}
                      items={1}
                      readOnly
                      itemStyles={{
                        itemShapes: StickerStar,
                        activeFillColor: "#f59e0b",
                        inactiveFillColor: "#f59e0b",
                      }}
                    />
                    <p className="text-4xl">
                      {author.averageRating
                        ? author.averageRating.toFixed(1)
                        : 0}
                    </p>
                  </div>
                  <div className="flex h-fit flex-row items-center justify-between gap-2">
                    <p className="whitespace-nowrap text-xs text-foreground/50">
                      {author.ratingsCount || 0} ratings
                    </p>
                    <span className="h-1 w-1 rounded-full bg-foreground/50 md:block" />
                    <p className="whitespace-nowrap text-xs text-foreground/50">
                      {author.reviewsCount || 0} reviews
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex w-fit items-center justify-evenly gap-2">
                <p>
                  {new Date(author?.birthDate!)?.toLocaleDateString("en-GB", {
                    weekday: undefined,
                    day: "numeric",
                    month: "numeric",
                    year: "numeric",
                  })}
                </p>
                -
                <p>
                  {new Date(author?.deathDate!)?.toLocaleDateString("en-GB", {
                    weekday: undefined,
                    day: "numeric",
                    month: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            <p className="text-foreground/65">{author?.bio}</p>
          </div>
          <Tabs defaultValue="books" className="w-full">
            <TabsList className="bg-background">
              <TabsTrigger value="books" asChild>
                <Button
                  variant="link"
                  className="text-muted-foreground data-[state=active]:shadow-none"
                >
                  Books
                </Button>
              </TabsTrigger>
              <Separator orientation="vertical" />
              <TabsTrigger value="reviews" asChild>
                <Button
                  variant="link"
                  className="text-muted-foreground data-[state=active]:shadow-none"
                >
                  Reviews
                </Button>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="books" className="mt-4">
              {authorBooks}
            </TabsContent>
            <TabsContent value="reviews" className="mt-4 flex flex-col gap-6">
              {author?.ratings?.length > 0 ? (
                author?.ratings.map((rating) => (
                  <div
                    key={rating.id}
                    className="flex w-full flex-col items-start gap-2"
                  >
                    <div className="flex w-full items-start gap-4">
                      <div className="flex gap-2">
                        <Avatar>
                          <AvatarImage
                            src={rating.user.imageUrl}
                            alt={rating.user.firstName}
                          />
                          <AvatarFallback>
                            {`${rating?.user?.firstName?.charAt(0) || "U"}`}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col justify-between gap-1">
                          <p className="text-sm text-foreground">
                            {rating.user.firstName || "user"}{" "}
                            {rating.user.lastName || "user"}
                          </p>
                          <p className="text-sm text-foreground/50">
                            {new Date(
                              rating?.updatedAt as string
                            ).toLocaleDateString("en-GB", {
                              weekday: undefined,
                              day: "numeric",
                              month: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <Separator
                        orientation="vertical"
                        className="h-8 self-center"
                      />
                      <ReactRating
                        className="w-full"
                        readOnly
                        style={{ width: "100px" }}
                        value={rating.rating}
                        itemStyles={{
                          itemShapes: StickerStar,
                          activeFillColor: "#f59e0b",
                          inactiveFillColor: "#ffedd5",
                        }}
                      />
                    </div>
                    <p className="line-clamp-5 pl-12 text-sm text-foreground">
                      {rating.review}
                    </p>
                  </div>
                ))
              ) : (
                <p className="line-clamp-5 text-sm text-foreground/50">
                  no review yet
                </p>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
