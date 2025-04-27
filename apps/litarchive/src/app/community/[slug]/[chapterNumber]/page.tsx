import honoClient from "@/app/honoRPCClient";
import ChapterEditor from "@/components/ChapterEditor";
import Contenteditable from "@/components/Contenteditable";
import ReadOnlyTiptapEditor from "@/components/ReadonlyTiptapEditor";
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

  if (!chapter.isUserEditor || !userId || userId === "null") {
    return (
      <div className="flex w-full flex-col gap-6">
        <div className="itemc-center flex w-full flex-col gap-4">
          <p className="text-foreground/50">Chapter {chapter.number || ""}</p>
          <Contenteditable
            contenteditable={false}
            text={chapter.versions[0]?.name || "no title yet"}
            className="text-2xl font-bold capitalize"
            placeholder="Title..."
          />
        </div>
        <ReadOnlyTiptapEditor
          content={chapter.versions[0]?.content || "no content yet"}
        />
      </div>
    );
  }

  return <ChapterEditor chapter={chapter} key={chapter.id} />;
}
