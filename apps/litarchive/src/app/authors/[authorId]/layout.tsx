import honoClient from "@/app/honoRPCClient";

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

  const res = await honoClient.authors[":authorId"].$get({
    param: {
      authorId,
    },
  });
  const author = await res.json();
  return (
    <div className="mt-0 flex w-full flex-col items-center justify-between p-3 sm:p-6 md:p-10 lg:mt-16">
      <div className="relative flex max-w-[1000px] flex-col gap-10 lg:flex-row">
        {children}
        <div className="flex w-fit flex-col gap-10">
          <div className="flex w-full grow-[2] flex-col gap-4 lg:overflow-hidden">
            <div className="grid gap-1">
              <p className="text-4xl font-medium capitalize">{author?.name}</p>
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
