"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import BookCard from "@/components/BookCard";
import { useIntersectionObserver } from "@uidotdev/usehooks";
import { Loader2 } from "lucide-react";
import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useAuth } from "@clerk/nextjs";
import honoClient from "../honoRPCClient";

export default function BooksPage() {
  const { userId } = useAuth();
  const { register, watch } = useForm({ defaultValues: { search: "" } });

  const {
    data: infiniteData,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["infiniteBooks", { search: watch("search") }],
    queryFn: async ({ pageParam }: { pageParam: number | undefined }) => {
      const res = await honoClient.books.$get(
        {
          query: {
            limit: "30",
            offset: pageParam?.toString(),
            search: watch("search"),
          },
        },
        {
          headers: { Authorization: `${userId}` },
        }
      );

      return await res.json();
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const length = allPages.length;
      if (lastPage.length < 30) {
        return undefined;
      }
      return length * 30;
    },
  });

  const [ref, entry] = useIntersectionObserver({
    threshold: 0.5,
    root: null,
    rootMargin: "0px",
  });

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage) {
      fetchNextPage();
    }
  }, [entry, hasNextPage, fetchNextPage]);

  return (
    <div className="flex w-full flex-col gap-6 px-4 md:px-8 lg:max-w-[1000px] lg:p-0">
      <Input
        {...register("search")}
        className="w-full sm:w-[400px]"
        placeholder="Search for book by title or author name"
      />
      {isLoading && (
        <div className="flex h-screen w-full items-center justify-center">
          <Loader2 className="animate-spin" size={40} />
        </div>
      )}
      <div className="flex flex-row flex-wrap">
        <div className="grid w-full grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {infiniteData?.pages.map((page, index) => (
            <React.Fragment key={index}>
              {page.map((book, i) => {
                if (i === page.length - 1) {
                  return (
                    <BookCard
                      key={book.id}
                      ref={ref}
                      book={book}
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      isLiked={book?.userLikedBooks?.length > 0}
                    />
                  );
                }

                return (
                  <BookCard
                    key={book.id}
                    book={book}
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    isLiked={book?.userLikedBooks?.length > 0}
                  />
                );
              })}
            </React.Fragment>
          ))}
        </div>
        {isFetchingNextPage && (
          <div className="flex w-full items-center justify-center pt-4">
            <Loader2 className="animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}
