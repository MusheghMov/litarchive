import honoClient from "@/app/honoRPCClient";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ImageIcon } from "lucide-react";

export default async function CommunityBookPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let book;
  try {
    const bookJson = await honoClient.community.books[":slug"].$get({
      param: { slug },
    });

    if (bookJson.ok) {
      book = await bookJson.json();
    }
  } catch (error) {
    console.error("Error fetching community book:", error);
  }

  if (!book) {
    return <div>Not found</div>;
  }

  return (
    <div className="flex w-full gap-4">
      <div className="bg-card aspect-[2/3] w-[300px] flex-col justify-end overflow-hidden rounded border p-2">
        {book.coverImageUrl ? (
          <Image
            src={book.coverImageUrl}
            alt="Cover Image"
            className="aspect-square h-full w-full object-cover"
            width={300}
            height={300}
          />
        ) : (
          <ImageIcon className="h-full w-full object-cover" strokeWidth={1} />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex w-full flex-col items-start gap-1">
          <h1 className="text-2xl font-bold">{book.title}</h1>
          <p className="cursor-pointer text-gray-400 hover:underline">
            {book.user?.firstName + " " + book.user?.lastName}
          </p>
        </div>
        <div className="flex w-full gap-1">
          <Badge variant="outline" className="text-xs">
            Drama
          </Badge>
          <Badge variant="outline" className="text-xs">
            Romance
          </Badge>
          <Badge variant="outline" className="text-xs">
            Comedy
          </Badge>
        </div>
        <div className="flex w-full flex-col gap-1">
          <p className="font-bold">Description</p>
          <p className="text-sm text-gray-400">{book.description}</p>
        </div>
      </div>
    </div>
  );
}
