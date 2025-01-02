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
  const bookJson = await honoClient.books[":bookId"].$get({
    query: {
      page: page,
    },
    param: {
      bookId: bookId,
    },
  });
  const book = await bookJson.json();
  return {
    // title: book?.title,
    openGraph: {
      // title: book?.title as string,
      // description: (book?.textChunk as string).substring(0, 150),
      url: "https://litarchive.com/books/" + bookId,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      // title: book?.title as string,
      // description: (book?.textChunk as string).substring(0, 150),
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
    book = await bookJson.json();
    // InferResponseType
    if ((book as any)?.userLikedBooks?.length > 0) {
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
