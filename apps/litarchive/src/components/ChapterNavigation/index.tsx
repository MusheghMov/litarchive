"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import honoClient from "@/app/honoRPCClient";

export default function ChapterNavigation({
  bookSlug,
  chapterNumber,
}: {
  bookSlug: string;
  chapterNumber: string;
}) {
  const { data: navigation, isLoading } = useQuery({
    queryKey: ["chapter-navigation", bookSlug, chapterNumber],
    queryFn: async () => {
      const response = await honoClient.community.chapters.navigation[
        "by-book"
      ][":bookSlug"][":chapterNumber"].$get({
        param: { bookSlug, chapterNumber },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch navigation data");
      }
      return response.json();
    },
    enabled: !!(bookSlug && chapterNumber),
  });

  if (isLoading || !navigation || !bookSlug) {
    return null;
  }

  const { previous, next } = navigation;

  return (
    <nav
      className="bg-background/95 supports-[backdrop-filter]:bg-background/60 fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full border shadow-lg backdrop-blur"
      aria-label="Chapter navigation"
    >
      <div className="flex items-center gap-1 p-1">
        {previous ? (
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="hover:bg-accent h-8 rounded-full px-2 transition-all"
          >
            <Link
              href={`/books/${bookSlug}/${previous.number}?chapterId=${previous.id}`}
              className="flex items-center gap-1"
              aria-label={`Go to previous chapter: ${previous.title || `Chapter ${previous.number}`}`}
            >
              <ChevronLeftIcon className="size-3.5 shrink-0" />
              <span className="max-w-20 truncate text-xs font-medium">
                {previous.title || `Ch ${previous.number}`}
              </span>
            </Link>
          </Button>
        ) : null}

        {previous && next && <div className="bg-border h-4 w-px" />}

        {next ? (
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="hover:bg-accent h-8 rounded-full px-2 transition-all"
          >
            <Link
              href={`/books/${bookSlug}/${next.number}?chapterId=${next.id}`}
              className="flex items-center gap-1"
              aria-label={`Go to next chapter: ${next.title || `Chapter ${next.number}`}`}
            >
              <span className="max-w-20 truncate text-xs font-medium">
                {next.title || `Ch ${next.number}`}
              </span>
              <ChevronRightIcon className="size-3.5 shrink-0" />
            </Link>
          </Button>
        ) : null}
      </div>
    </nav>
  );
}

