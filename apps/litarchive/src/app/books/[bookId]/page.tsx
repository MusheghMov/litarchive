import honoClient from "@/app/honoRPCClient";
import BookContent from "@/components/BookContent";
import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ bookId: string }>;
  searchParams: Promise<{ page: string }>;
};

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { bookId } = await params;
  const { page } = (await searchParams) || { page: "1" };
  let book;
  try {
    const bookJson = await honoClient.books[":bookId"].$get({
      query: {
        page: page,
      },
      param: {
        bookId: bookId,
      },
    });
    if (!bookJson.ok) {
      console.error("error: ", bookJson);
    } else {
      book = await bookJson.json();
    }
  } catch (error) {
    console.error("error", error);
  }

  return {
    title: `"${book?.title}" (by ${book?.author?.name})`,
    openGraph: {
      title: book?.title as string,
      images: [book?.author?.imageUrl as string],
      description: book?.textChunk.substring(0, 150),
      url: "https://litarchive.com/books/" + bookId,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `"${book?.title}" (by ${book?.author?.name})`,
      images: [book?.author?.imageUrl as string],
      description: book?.textChunk.substring(0, 150),
    },
  };
}

export default async function BookPage({ params, searchParams }: Props) {
  const { bookId } = await params;
  const { page } = await searchParams;
  const { userId } = await auth();
  let book;
  let isLiked = false;

  try {
    const bookJson = await honoClient.books[":bookId"].$get(
      {
        query: {
          page: page,
        },
        param: {
          bookId: bookId,
        },
      },
      { headers: { Authorization: `${userId}` } }
    );
    if (!bookJson.ok) {
      console.error("error: ", bookJson);
    } else {
      book = await bookJson.json();
    }

    if (book?.userLikedBooks && book?.userLikedBooks?.length > 0) {
      isLiked = true;
    }
  } catch (error) {
    console.error("error", error);
  }

  if (!book) {
    return (
      <div className="absolute flex h-[100cqh] w-full flex-col items-center justify-center space-y-4 p-2 text-center">
        <h1 className="text-4xl font-bold">Book not found</h1>
        <p className="text-lg">The book you are looking for does not exist.</p>
      </div>
    );
  }

  return <BookContent book={book} pageNumber={+page} isLiked={isLiked} />;
}
