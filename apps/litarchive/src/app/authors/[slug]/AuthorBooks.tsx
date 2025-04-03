"use client";

import honoClient from "@/app/honoRPCClient";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import BooksByAuthor from "./BooksByAuthor";
import { Loader2 } from "lucide-react";

export default function AuthorBooks({ authorId }: { authorId: number }) {
  const { userId } = useAuth();

  const { data: booksByAuthor, isLoading } = useQuery({
    queryKey: ["booksByAuthor", authorId],
    queryFn: async () => {
      const res = await honoClient.books.$get(
        {
          query: {
            authorId: authorId?.toString() || "",
            chunkSize: "4000",
          },
        },
        {
          headers: { Authorization: `${userId}` },
        }
      );

      if (!res.ok) {
        return null;
      }
      const booksByAuthor = await res.json();

      return booksByAuthor;
    },
    enabled: !!authorId,
  });

  return (
    <div className="flex w-full flex-col space-y-2">
      <div className="flex h-full w-full">
        {!!booksByAuthor && booksByAuthor.length > 0 ? (
          <BooksByAuthor booksByAuthor={booksByAuthor} />
        ) : (
          <>
            {isLoading ? (
              <div className="flex w-full min-w-[250px] items-center justify-center">
                <Loader2 className="animate-spin" size={40} />
              </div>
            ) : (
              <p>No books</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
