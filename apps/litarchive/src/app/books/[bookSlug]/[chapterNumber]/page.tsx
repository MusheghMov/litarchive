import honoClient from "@/app/honoRPCClient";
import ChapterEditor from "@/components/ChapterEditor";
import Contenteditable from "@/components/Contenteditable";
import ReadOnlyTiptapEditor from "@/components/ReadonlyTiptapEditor";
import { auth } from "@clerk/nextjs/server";

export default async function ChapterPage({
  searchParams,
}: {
  searchParams: Promise<{ chapterId: string }>;
}) {
  const { getToken, userId } = await auth();
  const { chapterId } = await searchParams;
  let chapter;

  try {
    const token = await getToken();
    const chapterJson = await honoClient.community.chapters[":chapterId"].$get(
      {
        param: { chapterId: chapterId },
      },
      {
        headers: { ...(token && { Authorization: token }) },
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

  return (
    <>
      {!(
        chapter.isUserEditor ||
        chapter.isUserAuthor ||
        chapter.isUserViewer
      ) ||
      !userId ||
      userId === "null" ? (
        <>
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
        </>
      ) : (
        <ChapterEditor chapter={chapter} key={chapter.id} />
      )}
    </>
  );
}
