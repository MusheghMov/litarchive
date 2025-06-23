"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import honoClient from "@/app/honoRPCClient";

interface ChapterNavigationProps {
  chapterId: string;
}

export default function ChapterNavigation({ chapterId }: ChapterNavigationProps) {
  const { data: navigation, isLoading } = useQuery({
    queryKey: ["chapter-navigation", chapterId],
    queryFn: async () => {
      const response = await honoClient.community.chapters.navigation[":chapterId"].$get({
        param: { chapterId },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch navigation data");
      }
      return response.json();
    },
  });

  if (isLoading || !navigation) {
    return null;
  }

  const { previous, next, bookSlug } = navigation;

  return (
    <nav 
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 rounded-full border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg"
      aria-label="Chapter navigation"
    >
      <div className="flex items-center gap-1 p-1">
        {previous && bookSlug ? (
          <Button 
            variant="ghost" 
            size="sm"
            asChild 
            className="h-8 px-2 rounded-full transition-all hover:bg-accent"
          >
            <Link
              href={`/books/${bookSlug}/${previous.number}?chapterId=${previous.id}`}
              className="flex items-center gap-1"
              aria-label={`Go to previous chapter: ${previous.title || `Chapter ${previous.number}`}`}
            >
              <ChevronLeftIcon className="size-3.5 shrink-0" />
              <span className="text-xs font-medium max-w-20 truncate">
                {previous.title || `Ch ${previous.number}`}
              </span>
            </Link>
          </Button>
        ) : null}

        {previous && next && (
          <div className="w-px h-4 bg-border" />
        )}

        {next && bookSlug ? (
          <Button 
            variant="ghost" 
            size="sm"
            asChild 
            className="h-8 px-2 rounded-full transition-all hover:bg-accent"
          >
            <Link
              href={`/books/${bookSlug}/${next.number}?chapterId=${next.id}`}
              className="flex items-center gap-1"
              aria-label={`Go to next chapter: ${next.title || `Chapter ${next.number}`}`}
            >
              <span className="text-xs font-medium max-w-20 truncate">
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