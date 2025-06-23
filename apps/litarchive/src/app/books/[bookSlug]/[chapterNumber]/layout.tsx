import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";
import { Suspense } from "react";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import honoClient from "@/app/honoRPCClient";
import ChapterNavigationWrapper from "@/components/ChapterNavigationWrapper";

export default async function CommunityLayout({
  params,
  children,
}: {
  params: Promise<{ bookSlug: string; chapterNumber: string }>;
  children: React.ReactNode;
}) {
  const { getToken } = await auth();
  const { bookSlug, chapterNumber } = await params;
  let chapters;
  let currentChapter;

  try {
    const token = await getToken();

    const chaptersJson = await honoClient.community.chapters["by-slug"][
      ":bookSlug"
    ].$get(
      {
        param: { bookSlug: bookSlug },
      },
      {
        headers: { ...(token && { Authorization: token }) },
      }
    );

    if (chaptersJson.ok) {
      chapters = await chaptersJson.json();
      currentChapter = chapters.find(
        (chapter) => chapter.number === +chapterNumber
      );
    }
  } catch (error) {
    console.error("Error fetching chapters:", error);
  }

  return (
    <>
      <div className="flex w-full flex-col gap-6">
        <Breadcrumb className="bg-background sticky top-16 z-10 rounded border border-dashed p-1">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/books/${currentChapter?.userBook.slug}`}>
                  {currentChapter?.userBook.title}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5">
                  {currentChapter?.title || `Chapter ${currentChapter?.number}`}
                  <ChevronDownIcon />
                </DropdownMenuTrigger>
                {chapters && chapters.length > 0 && (
                  <DropdownMenuContent align="start">
                    {chapters?.map((chapter) => (
                      <DropdownMenuItem key={chapter.id} asChild>
                        <Link
                          href={`/books/${bookSlug}/${chapter.number}?chapterId=${chapter.id}`}
                        >
                          {chapter.title}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                )}
              </DropdownMenu>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Suspense
          fallback={
            <div className="flex w-full flex-col gap-10">
              <Skeleton className="h-12 w-[65%] rounded" />
              <div className="flex flex-col gap-4">
                {new Array(40).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-6 w-full rounded" />
                ))}
              </div>
            </div>
          }
        >
          {children}
        </Suspense>
      </div>
      <ChapterNavigationWrapper />
    </>
  );
}
