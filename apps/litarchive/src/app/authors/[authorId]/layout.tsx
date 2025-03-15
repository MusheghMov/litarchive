import honoClient from "@/app/honoRPCClient";
import { Rating, StickerStar } from "@smastrom/react-rating";
import { Separator } from "@/components/ui/separator";

import { auth } from "@clerk/nextjs/server";

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
          <div className="flex w-full grow-[2] flex-col gap-4 lg:overflow-hidden">
            <div className="grid gap-1">
              <div className="flex gap-4">
                <p className="text-4xl font-medium capitalize">
                  {author?.name}
                </p>
                <Separator orientation="vertical" />
                <div className="flex gap-2">
                  <Rating
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
                  <p className="text-4xl">{author.averageRating || 0}</p>
                  <div className="flex h-fit flex-row items-center justify-between gap-2">
                    <p className="text-xs text-foreground/50">
                      {author.ratingsCount || 0} ratings
                    </p>
                    <span className="h-1 w-1 rounded-full bg-foreground/50" />
                    <p className="text-xs text-foreground/50">
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
          {authorBooks}
        </div>
      </div>
    </div>
  );
}
