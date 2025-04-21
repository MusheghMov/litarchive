import honoClient from "@/app/honoRPCClient";
import ChapterEditor from "@/components/ChapterEditor";
import { auth } from "@clerk/nextjs/server";

export default async function ChapterPage({
  params,
  searchParams,
}: {
  params: Promise<{ chapterNumber: string }>;
  searchParams: Promise<{ chapterId: string }>;
}) {
  const { userId } = await auth();
  const { chapterId } = await searchParams;
  let chapter;

  try {
    const chapterJson = await honoClient.community.chapters[":chapterId"].$get(
      {
        param: { chapterId: chapterId },
      },
      {
        headers: { Authorization: `${userId}` },
      }
    );

    if (chapterJson.ok) {
      chapter = await chapterJson.json();
    }
  } catch (error) {
    console.error("Error fetching chapter:", error);
  }

  if (!chapter) {
    return <div>Not found</div>;
  }

  return <ChapterEditor chapter={chapter} />;
}
