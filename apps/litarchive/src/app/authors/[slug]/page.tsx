import Image from "next/image";
import Rating from "@/components/Rating";
import type { Metadata } from "next";
import honoClient from "@/app/honoRPCClient";
import { auth } from "@clerk/nextjs/server";
import AuthorReview from "@/components/AuthorReview";
// @ts-ignore
import { unstable_ViewTransition as ViewTransition } from "react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const res = await honoClient.authors["by-slug"][":slug"].$get({
    param: { slug },
  });

  const author = await res.json();

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

  const res = await honoClient.authors["by-slug"][":slug"].$get(
    {
      param: { slug },
    },
    {
      headers: { Authorization: `${userId}` },
    }
  );

  const author = await res.json();

  return (
    <div className="top-20 flex w-full grow-[1] flex-col gap-4 self-start lg:sticky lg:w-auto">
        <ViewTransition name={`${author.slug}`}>
      <div className="relative max-h-[350px] min-h-[350px] w-fit min-w-[250px] max-w-[250px] overflow-hidden border-transparent p-1 outline-1 lg:rounded-lg lg:border-2">
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
  );
}
