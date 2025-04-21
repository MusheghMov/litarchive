"use client";
import honoClient from "@/app/honoRPCClient";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import TiptapEditor from "../TiptapEditor";
import { Chapter } from "@/types";
import { useEffect, useState, useRef } from "react";
import useDebounce from "@/lib/useDebounce";

export default function ChapterEditor({ chapter }: { chapter: Chapter }) {
  const [saved, setSaved] = useState(true);
  const [content, setContent] = useState(chapter.content);
  const debouncedContent = useDebounce(content, 500);

  const { userId } = useAuth();
  const titleRef = useRef<HTMLDivElement>(null);

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
    // onError: () => {
    //   console.log("error");
    // },
  });
  const { mutate: onUpdateContent } = useMutation({
    mutationFn: async (content: string) => {
      return await honoClient.community.chapters[":chapterId"].$put(
        {
          param: { chapterId: chapter.id.toString() },
          form: { content: content },
        },
        {
          headers: { Authorization: `${userId}` },
        }
      );
    },
    onSuccess: async (_res) => {
      setSaved(true);
    },
    // onError: () => {
    //   console.log("error");
    // },
  });

  useEffect(() => {
    onUpdateContent(debouncedContent);
  }, [debouncedContent]);
  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.innerText = chapter.title;
    }
  }, [chapter.title]);

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="itemc-center flex w-full flex-col gap-1">
        <p className="text-foreground/50">Chapter {chapter.number}</p>
        <div
          ref={titleRef}
          onBlur={(e) => {
            onUpdateTitle(e.target.innerText);
          }}
          contentEditable={true}
          className="before:text-foreground/50 h-min min-h-0 w-full text-2xl font-bold capitalize before:pointer-events-none empty:before:content-['Title...'] focus-visible:outline-none"
          aria-placeholder="Title..."
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
