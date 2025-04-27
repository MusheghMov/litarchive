"use client";

import honoClient from "@/app/honoRPCClient";
import useDebounce from "@/lib/useDebounce";
import { cn } from "@/lib/utils";
import { useModal } from "@/providers/ModalProvider";
import { Chapter, ChapterVersion } from "@/types";
import { useAuth } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ChapterVersionPicker } from "../ChapterVersionPicker";
import Contenteditable from "../Contenteditable";
import ReadOnlyTiptapEditor from "../ReadonlyTiptapEditor";
import TiptapEditor from "../TiptapEditor";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

export default function ChapterEditor({ chapter }: { chapter: Chapter }) {
  const router = useRouter();
  const { openModal } = useModal();
  const [saved, setSaved] = useState(true);
  const [content, setContent] = useState(chapter.content);
  const debouncedContent = useDebounce(content, 500);
  const [selectedChapterVersion, setSelectedChapterVersion] =
    useState<ChapterVersion | null>(null);

  const { userId } = useAuth();

  const { mutate: onSaveDraftAsVersion } = useMutation({
    mutationFn: async () => {
      return await honoClient.community.chapters.versions[":chapterId"].$post(
        {
          param: { chapterId: chapter.id.toString() },
          form: { name: chapter.title!, content: content! },
        },
        {
          headers: { Authorization: `${userId}` },
        }
      );
    },
    onError: () => {
      toast.error("Error saving chapter");
    },
    onSuccess: async (res) => {
      if (res.ok) {
        const chapterVersion = await res.json();
        toast.success(`Saved as version ${chapterVersion.versionNumber}`);
        router.refresh();
      }
    },
  });
  const { mutate: onPublishChapterVersion, isPending: isPublishing } =
    useMutation({
      mutationFn: async (chapterVersionId: number) => {
        return await honoClient.community.chapters.versions[
          ":chapterVersionId"
        ].$put(
          {
            param: { chapterVersionId: chapterVersionId.toString() },
            query: { chapterId: chapter.id.toString() },
          },
          {
            headers: { Authorization: `${userId}` },
          }
        );
      },
      onError: () => {
        toast.error("Error publishing chapter");
      },
      onSuccess: () => {
        router.refresh();
      },
    });
  const { mutate: onUpdateTitle } = useMutation({
    mutationFn: async (title: string) => {
      return await honoClient.community.chapters[":chapterId"].$put(
        {
          param: { chapterId: chapter.id.toString() },
          form: { title: title },
        },
        {
          headers: { Authorization: `${userId}` },
        }
      );
    },
    onError: () => {
      toast.error("Error saving chapter title");
    },
  });
  const { mutate: onUpdateContent } = useMutation({
    mutationFn: async (content: string) => {
      return await honoClient.community.chapters[":chapterId"].$put(
        {
          param: { chapterId: chapter.id.toString() },
          form: { content: content.trim() },
        },
        {
          headers: { Authorization: `${userId}` },
        }
      );
    },
    onSuccess: async (_res) => {
      setSaved(true);
    },
    onError: () => {
      toast.error("Error saving chapter content");
    },
  });

  useEffect(() => {
    onUpdateContent(debouncedContent);
  }, [debouncedContent]);
  useEffect(() => {
    if (chapter) {
      setSelectedChapterVersion(
        (prev) =>
          chapter.versions.find((version) => version.id === prev?.id) || prev
      );
    }
  }, [chapter]);

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="itemc-center flex w-full flex-col gap-4">
        <div className="flex h-fit w-full flex-col items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <p className="text-foreground/50">Chapter {chapter.number}</p>
            <ChapterVersionPicker
              draftName={chapter.title!}
              chapterVersions={chapter.versions}
              selectedChapterVersion={selectedChapterVersion}
              setSelectedChapterVersion={setSelectedChapterVersion}
            />
            <Badge
              variant="outline"
              className={cn(
                selectedChapterVersion
                  ? selectedChapterVersion.isCurrentlyPublished
                    ? "bg-green-300 text-green-900"
                    : "bg-amber-300 text-amber-900"
                  : "bg-gray-300 text-gray-900"
              )}
            >
              {selectedChapterVersion
                ? selectedChapterVersion.isCurrentlyPublished
                  ? "Published"
                  : "not published"
                : "Draft"}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {selectedChapterVersion ? (
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => {
                    onPublishChapterVersion(selectedChapterVersion.id);
                  }}
                  className="text-background cursor-pointer capitalize"
                  disabled={
                    isPublishing ||
                    !!selectedChapterVersion.isCurrentlyPublished
                  }
                >
                  publish
                </Button>
                <Button
                  onClick={() => {
                    openModal({
                      modalName: "WarningModal",
                      props: {
                        title: "Existing draft will be replaced",
                        description:
                          "Are you sure you want to create a new draft?",
                        onContinue: async () => {
                          onUpdateTitle(selectedChapterVersion.name);
                          onUpdateContent(selectedChapterVersion.content, {
                            onSuccess: () => {
                              toast.success("Draft created");
                              router.refresh();
                              setContent(selectedChapterVersion.content);
                              setSelectedChapterVersion(null);
                            },
                            onError: () => {
                              toast.error("Error creating draft");
                            },
                          });
                        },
                      },
                    });
                  }}
                  className="text-background cursor-pointer capitalize"
                >
                  create draft from this version
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => {
                  onSaveDraftAsVersion();
                }}
                className="text-background cursor-pointer capitalize"
              >
                save as a version
              </Button>
            )}
          </div>
        </div>
        <Contenteditable
          contenteditable={!selectedChapterVersion}
          onBlur={(e) => {
            if (!selectedChapterVersion) {
              return;
            }
            onUpdateTitle(e.target.innerText);
          }}
          text={chapter.title!}
          className="text-2xl font-bold capitalize"
          placeholder="Title..."
        />
      </div>
      {selectedChapterVersion ? (
        <ReadOnlyTiptapEditor
          key={selectedChapterVersion.id}
          content={selectedChapterVersion.content}
        />
      ) : (
        <TiptapEditor
          editable={true}
          content={content!}
          onUpdate={({ editor }) => {
            // check if the content is different from the current chapter
            if (editor.getHTML() !== chapter.content) {
              setSaved(false);
              setContent(editor.getHTML());
            }
          }}
          saved={saved}
        />
      )}
    </div>
  );
}
