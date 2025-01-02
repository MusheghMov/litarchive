import { Minus } from "lucide-react";
import Image from "next/image";
import type { Metadata } from "next";
import honoClient from "@/app/honoRPCClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ authorId: string }>;
}): Promise<Metadata> {
  const { authorId } = await params;
  const res = await honoClient.authors[":authorId"].$get({
    param: { authorId },
  });

  const author = await res.json();

  return {
    title: author?.name,
    openGraph: {
      title: author?.name as string,
      description: author?.bio?.substring(0, 150),
      url: "https://litarchive.com/authors/" + authorId,
      type: "website",
      images: [author?.imageUrl as string],
    },
    twitter: {
      card: "summary_large_image",
      title: author?.name as string,
      description: author?.bio?.substring(0, 150),
      images: [author?.imageUrl as string],
    },
  };
}
export default async function AuthorPage({
  params,
}: {
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
    <div className="flex w-full flex-col items-start justify-between overflow-hidden lg:flex-row lg:space-x-10">
      <div className="flex w-full grow-[1] flex-col lg:w-auto">
        <div className="relative min-h-[650px] min-w-[500px] overflow-hidden lg:rounded-br-[100px]">
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
        <div className="flex w-full flex-row items-center justify-evenly gap-2 px-8 py-14">
          <div>
            <p className="text-xs uppercase">Born</p>
            <p className="text-base font-bold md:text-3xl">
              {new Date(author?.birthDate!)?.toLocaleDateString("en-GB", {
                weekday: undefined,
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
            <p className="text-xs uppercase opacity-0">Born</p>
          </div>
          <Minus size="40px" />
          <div>
            <p className="text-xs uppercase">Died</p>
            <p className="text-base font-bold md:text-3xl">
              {new Date(author?.deathDate!)?.toLocaleDateString("en-GB", {
                weekday: undefined,
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
            <p className="text-xs uppercase opacity-0">Born</p>
          </div>
        </div>
      </div>
      <div className="flex w-full grow-[2] flex-col space-y-10 px-8 py-4 lg:overflow-hidden lg:px-10">
        <div className="flex flex-col gap-4 lg:max-w-[70%]">
          <p className="text-4xl font-medium capitalize">{author?.name}</p>
          <p className="text-foreground/65">{author?.bio}</p>
        </div>
      </div>
    </div>
  );
}
