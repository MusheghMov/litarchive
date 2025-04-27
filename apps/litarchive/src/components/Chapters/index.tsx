"use client";

import { useMutation } from "@tanstack/react-query";
import { Button } from "../ui/button";
import honoClient from "@/app/honoRPCClient";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Chapters({
  bookId,
  bookSlug,
  chapters,
  isUserEditor,
}: {
  bookId: string;
  bookSlug: string;
  chapters: any;
  isUserEditor: boolean;
}) {
  const { userId } = useAuth();
  const router = useRouter();
  const { mutate: onCreateChapter } = useMutation({
    mutationFn: async () => {
      return await honoClient.community.chapters[":bookId"].$post(
        {
          param: { bookId: bookId },
          form: {},
        },
        {
          headers: { Authorization: `${userId}` },
        }
      );
    },
    onSuccess: async (res) => {
      if (res.ok) {
        const response = await res.json();

        router.push(
          `/community/${bookSlug}/${response[0].number}?chapterId=${response[0].id}`
        );
      }
    },
  });

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex w-full items-center justify-between gap-2">
        <p className="text-lg font-bold">Chapters</p>
        {isUserEditor && (
          <Button
            variant="outline"
            className="text-xs"
            onClick={() => {
              onCreateChapter();
            }}
          >
            Add Chapter
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {chapters?.map((chapter: any) => (
          <Link
            key={chapter.id}
            href={`/community/${bookSlug}/${chapter.number}?chapterId=${chapter.id}`}
            className="bg-card h-fit w-full justify-end overflow-hidden rounded border p-2"
          >
            <p className="text-sm text-gray-400">Chapter {chapter.number}</p>
            {chapter.title && (
              <p className="text-lg font-bold capitalize">{chapter.title}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
