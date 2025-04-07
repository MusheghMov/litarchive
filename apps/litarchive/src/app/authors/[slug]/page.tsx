import honoClient from "@/app/honoRPCClient";
import AuthorReview from "@/components/AuthorReview";
import Rating from "@/components/Rating";
import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Rating as ReactRating, StickerStar } from "@smastrom/react-rating";
// @ts-ignore
import { cache, unstable_ViewTransition as ViewTransition } from "react";
import AuthorBooks from "./AuthorBooks";

const cachedGetAuthor = cache(async (slug: string, userId?: string) => {
  const res = await honoClient.authors["by-slug"][":slug"].$get(
    {
      param: { slug },
    },
    {
      headers: { Authorization: `${userId}` },
    }
  );
  return await res.json();
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const author = await cachedGetAuthor(slug);

  return {
    title: author?.name,
    openGraph: {
      title: `${author?.name as string}\n(${author.name_original as string})`,
      description: author?.bio?.substring(0, 150),
      url: "https://litarchive.com/authors/" + slug,
      type: "website",
      images: [author?.imageUrl as string],
    },
    twitter: {
      card: "summary_large_image",
      title: `${author?.name as string}\n(${author.name_original as string})`,
      description: author?.bio?.substring(0, 150),
      images: [author?.imageUrl as string],
    },
  };
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { userId } = await auth();

  const author = await cachedGetAuthor(slug, userId!);

  return (
    <>
      <div className="top-20 flex w-full grow-[1] flex-col gap-4 self-start lg:sticky lg:w-auto">
        <ViewTransition name={`${author.slug}`}>
          <div className="relative max-h-[350px] min-h-[350px] w-fit max-w-[250px] min-w-[250px] overflow-hidden border-transparent p-1 outline-1 lg:rounded-lg lg:border-2">
            <Image
              src={
                author?.imageUrl ||
                "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Tumanyan_%282%29.jpg/640px-Tumanyan_%282%29.jpg"
              }
              className="h-full w-full object-cover object-top"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              quality={30}
              alt="author"
            />
          </div>
        </ViewTransition>
        <div className="flex flex-col items-start gap-1">
          <p className="self-start text-base font-medium capitalize">
            your rating
          </p>
          <Rating
            initialRating={author.userRating || 0}
            authorId={author?.id?.toString()}
            userId={userId?.toString()}
          />
        </div>
        <AuthorReview author={author} />
      </div>

      <div className="flex w-fit flex-col gap-10">
        <div className="flex w-full flex-col gap-4 lg:overflow-hidden">
          <div className="grid gap-2">
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-start gap-1">
                <p className="text-4xl font-medium capitalize">
                  {author?.name}
                </p>
                {author?.name_original && (
                  <p className="text-xl capitalize">
                    ({author?.name_original})
                  </p>
                )}
              </div>
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
                      ? Number.isInteger(author.averageRating)
                        ? author.averageRating
                        : author.averageRating.toFixed(1)
                      : 0}
                  </p>
                </div>
                <div className="flex h-fit flex-row items-center justify-between gap-2">
                  <p className="text-foreground/50 text-xs whitespace-nowrap">
                    {author.ratingsCount || 0} ratings
                  </p>
                  <span className="bg-foreground/50 h-1 w-1 rounded-full md:block" />
                  <p className="text-foreground/50 text-xs whitespace-nowrap">
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
            <AuthorBooks authorId={author?.id} />
          </TabsContent>
          <TabsContent value="reviews" className="mt-4 flex flex-col gap-6">
            {author?.ratings?.length > 0 ? (
              author?.ratings.map((rating, index) => (
                <div
                  key={`${rating.id}-${index}`}
                  className="flex w-full flex-col items-start gap-2"
                >
                  <div className="flex w-full items-start gap-4">
                    <div className="flex gap-2">
                      <Avatar className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border">
                        <AvatarImage
                          src={rating.user.imageUrl}
                          alt={rating.user.firstName}
                        />
                        <AvatarFallback>
                          {`${rating?.user?.firstName?.charAt(0) || "U"}`}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col justify-between gap-1">
                        <p className="text-foreground text-sm">
                          {rating.user.firstName || "user"}{" "}
                          {rating.user.lastName || "user"}
                        </p>
                        <p className="text-foreground/50 text-sm">
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
                  <p className="text-foreground line-clamp-5 pl-12 text-sm">
                    {rating.review}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-foreground/50 line-clamp-5 text-sm">
                no review yet
              </p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
