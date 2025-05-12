import honoClient from "@/app/honoRPCClient";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import Chapters from "@/components/Chapters";
import { auth } from "@clerk/nextjs/server";
import CommunityBookInfo from "@/components/CommunityBookInfo";
import { CollaboratorEditor } from "@/components/CollaboratorEditor";

export default async function CommunityBookPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { getToken } = await auth();
  const { slug } = await params;
  let book;
  let chapters;

  try {
    const token = await getToken();
    const bookJson = await honoClient.community.books[":slug"].$get(
      {
        param: { slug },
      },
      {
        headers: { Authorization: token || "" },
      }
    );

    if (bookJson.ok) {
      book = await bookJson.json();

      const chaptersJson = await honoClient.community.chapters.$get(
        {
          query: { bookId: book.id.toString() },
        },
        {
          headers: { Authorization: token || "" },
        }
      );

      if (chaptersJson.ok) {
        chapters = await chaptersJson.json();
      }
    }
  } catch (error) {
    console.error("Error fetching community book:", error);
  }

  const genres = book?.genres.map((genre) => genre.genre);

  if (!book) {
    return <div>Not found</div>;
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex w-full flex-col gap-4 md:flex-row">
        <div className="bg-card aspect-[2/3] max-h-[600px] w-full flex-col justify-end overflow-hidden rounded border p-2 md:w-[300px]">
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

        <CommunityBookInfo book={book} genres={genres} />
      </div>
      <Chapters
        bookId={book.id.toString()}
        bookSlug={book.slug!}
        chapters={chapters}
        isUserAuthor={!!book.isUserAuthor}
        isUserEditor={!!book.isUserEditor}
      />
    </div>
  );
}
