import honoClient from "@/app/honoRPCClient";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import Chapters from "@/components/Chapters";
import { auth } from "@clerk/nextjs/server";
import CommunityBookInfo from "@/components/CommunityBookInfo";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ bookId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { bookId } = await params;
  let book;
  
  try {
    const bookJson = await honoClient.community.books[":slug"].$get({
      param: { slug: bookId },
    });
    
    if (bookJson.ok) {
      book = await bookJson.json();
    }
  } catch (error) {
    console.error("Error fetching community book:", error);
  }

  if (!book) {
    return {
      title: "Book not found",
    };
  }

  return {
    title: `"${book?.title}"`,
    openGraph: {
      title: `"${book?.title}"`,
      images: [book?.coverImageUrl as string],
      description: book?.description?.substring(0, 150),
      url: "https://litarchive.com/books/" + bookId,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `"${book?.title}"`,
      images: [book?.coverImageUrl as string],
      description: book?.description?.substring(0, 150),
    },
  };
}

export default async function BookPage({ params }: Props) {
  const { getToken } = await auth();
  const { bookId } = await params;
  let book;
  let chapters;

  try {
    const token = await getToken();
    const bookJson = await honoClient.community.books[":slug"].$get(
      {
        param: { slug: bookId },
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

  if (!book) {
    return (
      <div className="absolute flex h-[100cqh] w-full flex-col items-center justify-center space-y-4 p-2 text-center">
        <h1 className="text-4xl font-bold">Book not found</h1>
        <p className="text-lg">The book you are looking for does not exist.</p>
      </div>
    );
  }

  const genres = book?.genres.map((genre) => genre.genre);

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
