"use client";
import honoClient from "@/app/honoRPCClient";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import TiptapEditor from "../TiptapEditor";
import { Chapter } from "@/types";
import { useEffect, useState } from "react";
import useDebounce from "@/lib/useDebounce";
import Contenteditable from "../Contenteditable";

export default function ChapterEditor({ chapter }: { chapter: Chapter }) {
  const [saved, setSaved] = useState(true);
  const [content, setContent] = useState(chapter.content);
  const debouncedContent = useDebounce(content, 500);

  const { userId } = useAuth();

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
      console.error("error"); // TODO: handle error
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
      console.error("error"); // TODO: handle error
    },
  });

  useEffect(() => {
    onUpdateContent(debouncedContent);
  }, [debouncedContent]);

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="itemc-center flex w-full flex-col gap-1">
        <p className="text-foreground/50">Chapter {chapter.number}</p>
        <Contenteditable
          contenteditable={!!chapter.isUserEditor}
          onBlur={(e) => {
            onUpdateTitle(e.target.innerText);
          }}
          text={chapter.title}
          className="text-2xl font-bold capitalize"
          placeholder="Title..."
        />
      </div>
      <TiptapEditor
        editable={!!chapter.isUserEditor}
        content={content}
        onUpdate={({ editor }) => {
          setSaved(false);
          setContent(editor.getHTML());
        }}
        saved={saved}
      />
    </div>
  );
}
