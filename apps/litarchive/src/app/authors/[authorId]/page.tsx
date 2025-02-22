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
    <div className="top-20 flex w-fit grow-[1] flex-col gap-4 self-start lg:sticky lg:w-auto">
      <div className="relative max-h-[350px] min-h-[350px] w-fit min-w-[250px] max-w-[250px] overflow-hidden border-transparent p-1 outline outline-1 lg:rounded-lg lg:border-2">
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
    </div>
  );
}
