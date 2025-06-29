import honoClient from "@/app/honoRPCClient";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import Chapters from "@/components/Chapters";
import { auth } from "@clerk/nextjs/server";
import CommunityBookInfo from "@/components/CommunityBookInfo";
import StructuredData from "@/components/StructuredData";
import CoverImageDisplay from "@/components/CoverImageDisplay";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ bookSlug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { bookSlug } = await params;
  let book;

  try {
    const bookJson = await honoClient.community.books[":slug"].$get({
      param: { slug: bookSlug },
    });

    if (bookJson.ok) {
      book = await bookJson.json();
    }
  } catch (error) {
    console.error("Error fetching community book:", error);
  }

  if (!book) {
    return {
      title: "Book Not Found",
      description: "The requested book could not be found on LitArchive.",
    };
  }

  const genres =
    book.genres
      ?.map((g: any) => g.genre?.name)
      .filter(Boolean)
      .join(", ") || "";
  const authorName = book.user
    ? `${book.user.firstName} ${book.user.lastName}`.trim()
    : "Anonymous";

  return {
    title: `"${book.title}" by ${authorName} - Read on LitArchive`,
    description: book.description
      ? `${book.description.substring(0, 150)}... Read this ${genres ? genres + " " : ""}story by ${authorName} on LitArchive.`
      : `Read "${book.title}" by ${authorName} on LitArchive. ${genres ? `A ${genres} story` : "A community story"} created by independent authors.`,
    keywords: [
      book.title,
      authorName,
      ...(genres ? genres.split(", ") : []),
      "community book",
      "independent author",
      "digital story",
      "collaborative writing",
    ],
    authors: [{ name: authorName }],
    openGraph: {
      title: `"${book.title}" by ${authorName}`,
      description:
        book.description?.substring(0, 150) ||
        `Read this ${genres ? genres + " " : ""}story by ${authorName}`,
      images: book.coverImageUrl
        ? [
            {
              url: book.coverImageUrl,
              width: 1200,
              height: 630,
              alt: `Cover of "${book.title}" by ${authorName}`,
            },
          ]
        : [],
      url: `https://litarchive.com/books/${bookSlug}`,
      type: "article",
      authors: [authorName],
      tags: Array.isArray(genres)
        ? genres.map((g) => g?.name || g).filter(Boolean)
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `"${book.title}" by ${authorName}`,
      description:
        book.description?.substring(0, 150) ||
        `Read this ${genres ? genres + " " : ""}story by ${authorName}`,
      images: book.coverImageUrl
        ? [
            {
              url: book.coverImageUrl,
              width: 1200,
              height: 630,
              alt: `Cover of "${book.title}" by ${authorName}`,
            },
          ]
        : [],
    },
    alternates: {
      canonical: `/books/${bookSlug}`,
    },
  };
}

export default async function BookPage({ params }: Props) {
  const { getToken } = await auth();
  const { bookSlug } = await params;
  let book;
  let chapters;

  try {
    const token = await getToken();
    const bookJson = await honoClient.community.books[":slug"].$get(
      {
        param: { slug: bookSlug },
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
      <div className="flex h-full w-full flex-col items-center justify-center space-y-4 p-2 text-center">
        <h1 className="text-4xl font-bold">Book not found</h1>
        <p className="text-lg">The book you are looking for does not exist.</p>
      </div>
    );
  }

  const genres = book?.genres.map((genre) => genre.genre);
  const authorName = book.user
    ? `${book.user.firstName} ${book.user.lastName}`.trim()
    : "Anonymous";

  const bookSchema = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    author: {
      "@type": "Person",
      name: authorName,
      ...(book.user?.imageUrl && { image: book.user.imageUrl }),
    },
    description: book.description,
    genre: Array.isArray(genres)
      ? genres
          .map((g) => g?.name || g)
          .filter(Boolean)
          .join(", ")
      : "",
    datePublished: new Date().toISOString(),
    publisher: {
      "@type": "Organization",
      name: "LitArchive",
    },
    url: `https://litarchive.com/books/${bookSlug}`,
    ...(book.coverImageUrl && {
      image: book.coverImageUrl,
      thumbnailUrl: book.coverImageUrl,
    }),
    isAccessibleForFree: true,
    creativeWorkStatus: book.isPublic ? "Published" : "Draft",
  };

  console.log("Book: ", book);

  return (
    <>
      <StructuredData data={bookSchema} />
      <div className="flex w-full flex-col gap-4">
        <div className="flex w-full flex-col gap-4 md:flex-row">
          <div className="bg-card aspect-[2/3] max-h-[600px] w-full flex-col justify-end overflow-hidden rounded border p-2 md:w-[300px]">
            <CoverImageDisplay
              bookSlug={book.slug!}
              initialCoverImageUrl={book.coverImageUrl}
              initialImageStatus={book.imageStatus}
              className="aspect-square h-full w-full object-cover"
            />
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
    </>
  );
}
