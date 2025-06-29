"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { ImageIcon, Wand2 } from "lucide-react";
import honoClient from "@/app/honoRPCClient";
import { Skeleton } from "@/components/ui/skeleton";

export default function CoverImageDisplay({
  bookSlug,
  initialCoverImageUrl,
  initialImageStatus,
  className = "aspect-square h-full w-full object-cover",
}: {
  bookSlug: string;
  initialCoverImageUrl?: string | null;
  initialImageStatus?: string | null;
  className?: string;
}) {
  // Determine if we should poll
  const shouldPoll =
    !initialCoverImageUrl &&
    (initialImageStatus === "pending" ||
      initialImageStatus === "generating" ||
      initialImageStatus === null);

  const { data: imageStatus } = useQuery({
    queryKey: ["book-image-status", bookSlug],
    queryFn: async () => {
      const response = await honoClient.community.books[":bookSlug"][
        "image-status"
      ].$get({
        param: { bookSlug },
      });

      if (response.ok) {
        return await response.json();
      }
      throw new Error("Failed to fetch image status");
    },
    enabled: shouldPoll,
    refetchInterval: (queryData) => {
      const status = queryData.state.data?.imageStatus;
      if (status === "generating" || status === "pending") {
        return 2000;
      }
      return false;
    },
  });

  // Use current data from query if available, otherwise use initial props
  const currentCoverImageUrl =
    imageStatus?.coverImageUrl || initialCoverImageUrl;
  const currentImageStatus = imageStatus?.imageStatus || initialImageStatus;

  // Show skeleton with generating text if status is pending or generating
  if (
    (currentImageStatus === "pending" || currentImageStatus === "generating") &&
    !currentCoverImageUrl
  ) {
    return (
      <div className="relative flex h-full w-full flex-col items-center justify-center">
        <Skeleton className="h-full w-full rounded-lg" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center">
          <Wand2 className="text-muted-foreground mb-1 h-6 w-6 animate-pulse" />
          <p className="text-muted-foreground text-xs font-medium">
            {currentImageStatus === "generating"
              ? "Generating..."
              : "Pending..."}
          </p>
        </div>
      </div>
    );
  }

  // Show error state if failed
  if (currentImageStatus === "failed") {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center p-2">
        <ImageIcon
          className="text-muted-foreground mb-1 h-8 w-8"
          strokeWidth={1}
        />
        <p className="text-muted-foreground text-center text-xs">
          Generation failed
        </p>
      </div>
    );
  }

  // Show cover image if available
  if (currentCoverImageUrl) {
    return (
      <Image
        src={currentCoverImageUrl}
        alt="Cover Image"
        className={className}
        width={300}
        height={400}
      />
    );
  }

  // Default fallback - no cover image
  return <ImageIcon className={className} strokeWidth={1} />;
}
