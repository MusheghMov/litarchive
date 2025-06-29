"use client";

import honoClient from "@/app/honoRPCClient";
import { cn } from "@/lib/utils";
import { useModal } from "@/providers/ModalProvider";
import { Chapter, ChapterVersion } from "@/types";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ChapterVersionPicker } from "../ChapterVersionPicker";
import ReadOnlyTiptapEditor from "../ReadonlyTiptapEditor";
import TiptapEditor from "../TiptapEditor";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Check, XIcon, PencilIcon, AudioLines, Loader2 } from "lucide-react";

export default function ChapterEditor({ chapter }: { chapter: Chapter }) {
  const router = useRouter();
  const { getToken } = useAuth();
  const { openModal } = useModal();

  const [saved, setSaved] = useState(true);
  const [selectedChapterVersion, setSelectedChapterVersion] =
    useState<ChapterVersion | null>(null);
  const [isTitleEditing, setIsTitleEditing] = useState(false);
  const [titleValue, setTitleValue] = useState(
    selectedChapterVersion?.name || chapter.title || ""
  );
  const lastSavedContent = useRef(chapter.content);
  const timeout = useRef<NodeJS.Timeout>(null);

  const { mutate: onSaveDraftAsVersion } = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return await honoClient.community.chapters.versions[":chapterId"].$post(
        {
          param: { chapterId: chapter.id.toString() },
          form: { name: titleValue, content: lastSavedContent.current! },
        },
        {
          headers: { ...(token && { Authorization: token }) },
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
        const token = await getToken();
        return await honoClient.community.chapters.versions[
          ":chapterVersionId"
        ].$put(
          {
            param: { chapterVersionId: chapterVersionId.toString() },
            query: { chapterId: chapter.id.toString() },
          },
          {
            headers: { ...(token && { Authorization: token }) },
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
      const token = await getToken();
      return await honoClient.community.chapters[":chapterId"].$put(
        {
          param: { chapterId: chapter.id.toString() },
          form: { title: title },
        },
        {
          headers: { ...(token && { Authorization: token }) },
        }
      );
    },
    onError: () => {
      toast.error("Error saving chapter title");
    },
    onSuccess: () => {
      setIsTitleEditing(false);
      router.refresh();
    },
  });
  const { mutate: onUpdateContent } = useMutation({
    mutationFn: async (content: string) => {
      const token = await getToken();
      return await honoClient.community.chapters[":chapterId"].$put(
        {
          param: { chapterId: chapter.id.toString() },
          form: { content: content.trim() },
        },
        {
          headers: { ...(token && { Authorization: token }) },
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

  const { mutate: onGenerateAudio, isPending: isGeneratingAudio } = useMutation(
    {
      mutationFn: async () => {
        const token = await getToken();
        return await honoClient.community.chapters[":chapterId"][
          "generate-audio"
        ].$post(
          {
            param: { chapterId: chapter.id.toString() },
            json: { language: "en" },
          },
          {
            headers: { ...(token && { Authorization: token }) },
          }
        );
      },
      onError: () => {
        toast.error("Error generating audio");
      },
      onSuccess: async (res) => {
        if (res.ok) {
          toast.success("Audio generation started!");
          refetchAudioStatus();
        } else {
          toast.error("Failed to generate audio");
        }
      },
    }
  );

  const { data: audioStatus, refetch: refetchAudioStatus } = useQuery({
    queryKey: ["audioStatus", chapter.id],
    queryFn: async () => {
      const token = await getToken();
      const res = await honoClient.community.chapters[":chapterId"][
        "audio-status"
      ].$get(
        {
          param: { chapterId: chapter.id.toString() },
        },
        {
          headers: { ...(token && { Authorization: token }) },
        }
      );

      if (res.ok) {
        return await res.json();
      }
      throw new Error("Failed to fetch audio status");
    },
    enabled: (queryData) => {
      const status = queryData?.state.data;
      if (status?.audioStatus === "completed") {
        toast.success("Audio generation completed");
        return false;
      }
      return (
        !!(chapter.isUserAuthor || chapter.isUserEditor) &&
        !!(
          status?.audioStatus === "generating" ||
          status?.audioStatus === "pending"
        )
      );
    },
    refetchInterval: (data) => {
      const audioStatus = data.state.data?.audioStatus;
      if (audioStatus === "pending" || "generating") {
        return 2000;
      }
      return false;
    },
    refetchIntervalInBackground: true,
  });

  useEffect(() => {
    if (chapter) {
      setSelectedChapterVersion(
        (prev) =>
          chapter.versions.find((version) => version.id === prev?.id) || prev
      );
      setTitleValue(selectedChapterVersion?.name || chapter.title || "");
    }
  }, [chapter, selectedChapterVersion]);

  const handleTitleSave = () => {
    if (titleValue.trim()) {
      onUpdateTitle(titleValue.trim());
    } else {
      setTitleValue(chapter.title || "");
      setIsTitleEditing(false);
    }
  };

  const handleTitleCancel = () => {
    setTitleValue(selectedChapterVersion?.name || chapter.title || "");
    setIsTitleEditing(false);
  };

  return (
    <>
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
          {chapter.isUserViewer ? null : (
            <div className="flex items-center gap-2">
              {chapter.isUserEditor ? (
                <>
                  {selectedChapterVersion ? null : (
                    <Button
                      onClick={() => {
                        onSaveDraftAsVersion();
                      }}
                      className="cursor-pointer capitalize"
                    >
                      save as a version
                    </Button>
                  )}
                </>
              ) : (
                <>
                  {selectedChapterVersion ? (
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => {
                          onPublishChapterVersion(selectedChapterVersion.id);
                        }}
                        className="cursor-pointer capitalize"
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
                                onUpdateContent(
                                  selectedChapterVersion.content,
                                  {
                                    onSuccess: () => {
                                      toast.success("Draft created");
                                      router.refresh();
                                      lastSavedContent.current =
                                        selectedChapterVersion.content;
                                      setSelectedChapterVersion(null);
                                    },
                                    onError: () => {
                                      toast.error("Error creating draft");
                                    },
                                  }
                                );
                              },
                            },
                          });
                        }}
                        className="cursor-pointer capitalize"
                      >
                        create draft from this version
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => {
                        onSaveDraftAsVersion();
                      }}
                      className="cursor-pointer capitalize"
                    >
                      save as a version
                    </Button>
                  )}
                </>
              )}

              {(chapter.isUserAuthor || chapter.isUserEditor) &&
                !chapter.isUserViewer && (
                  <Button
                    onClick={() => onGenerateAudio()}
                    disabled={
                      isGeneratingAudio ||
                      audioStatus?.audioStatus === "pending" ||
                      audioStatus?.audioStatus === "generating" ||
                      !lastSavedContent.current?.trim()
                    }
                    variant="outline"
                    className="cursor-pointer"
                  >
                    {isGeneratingAudio ||
                    audioStatus?.audioStatus === "pending" ||
                    audioStatus?.audioStatus === "generating" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin rounded-full" />
                        {audioStatus?.audioStatus === "pending"
                          ? "starting..."
                          : "generating..."}
                      </>
                    ) : audioStatus?.audioStatus === "completed" ? (
                      <>
                        <AudioLines className="mr-2 h-4 w-4" />
                        Regenerate Audio
                      </>
                    ) : audioStatus?.audioStatus === "failed" ? (
                      <>
                        <AudioLines className="mr-2 h-4 w-4" />
                        Retry Audio
                      </>
                    ) : (
                      <>
                        <AudioLines className="mr-2 h-4 w-4" />
                        Generate Audio
                      </>
                    )}
                  </Button>
                )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isTitleEditing ? (
            <div className="flex flex-1 items-center gap-2">
              <input
                autoFocus
                type="text"
                value={titleValue}
                onChange={(e) => setTitleValue(e.target.value)}
                onKeyDown={(e: React.KeyboardEvent) => {
                  if (e.key === "Enter") {
                    handleTitleSave();
                  }
                }}
                onBlur={handleTitleCancel}
                className="border-primary flex-1 border-b-2 bg-transparent text-2xl font-bold capitalize outline-none"
                placeholder="Chapter title..."
              />
              <Button
                onClick={handleTitleSave}
                size="sm"
                variant="ghost"
                className="hover:text-primary hover:bg-background h-min w-min cursor-pointer rounded-full border border-dashed !p-1 text-green-600 hover:border-green-600"
              >
                <Check size={16} />
              </Button>
              <Button
                onClick={handleTitleCancel}
                size="sm"
                variant="ghost"
                className="hover:bg-background h-min w-min cursor-pointer rounded-full border border-dashed !p-1 text-red-600 hover:border-red-600 hover:text-red-700"
              >
                <XIcon size={16} />
              </Button>
            </div>
          ) : (
            <div className="flex w-full flex-1 items-center gap-4">
              <h1 className="line-clamp-2 text-2xl font-bold capitalize">
                {selectedChapterVersion
                  ? selectedChapterVersion.name || "no title yet"
                  : chapter.title || "no title yet"}
              </h1>
              {!(selectedChapterVersion || chapter.isUserViewer) && (
                <Button
                  onClick={() => {
                    setIsTitleEditing(true);
                  }}
                  size="sm"
                  variant="ghost"
                  className="text-primary hover:border-primary hover:text-primary hover:bg-background h-min w-min cursor-pointer rounded-full border border-dashed !p-1"
                >
                  <PencilIcon size={16} />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {selectedChapterVersion ? (
        <ReadOnlyTiptapEditor
          key={selectedChapterVersion.id}
          content={selectedChapterVersion.content}
        />
      ) : (
        <>
          {chapter.isUserViewer ? (
            <ReadOnlyTiptapEditor content={lastSavedContent.current!} />
          ) : (
            <TiptapEditor
              editable={true}
              content={lastSavedContent.current!}
              id={chapter.id.toString()}
              onUpdate={({ editor }) => {
                if (timeout.current) {
                  clearTimeout(timeout.current);
                  setSaved(false);
                }

                timeout.current = setTimeout(() => {
                  const newHTML = editor.getHTML();

                  if (newHTML !== lastSavedContent.current) {
                    lastSavedContent.current = newHTML;

                    onUpdateContent(newHTML); // <-- This should trigger the actual save (e.g., mutation or API call)

                    setSaved(true); // Optional UI indicator
                  }

                  timeout.current = null;
                }, 1000);
              }}
              saved={saved}
            />
          )}
        </>
      )}
    </>
  );
}
