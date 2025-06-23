"use client";

import { useSearchParams } from "next/navigation";
import ChapterNavigation from "@/components/ChapterNavigation";

export default function ChapterNavigationWrapper() {
  const searchParams = useSearchParams();
  const chapterId = searchParams.get("chapterId");

  if (!chapterId) {
    return null;
  }

  return <ChapterNavigation chapterId={chapterId} />;
}