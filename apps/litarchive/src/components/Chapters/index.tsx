"use client";

import { useMutation } from "@tanstack/react-query";
import { Button } from "../ui/button";
import honoClient from "@/app/honoRPCClient";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LoaderCircle, Plus, Trash } from "lucide-react";
import { useModal } from "@/providers/ModalProvider";
import { toast } from "sonner";

export default function Chapters({
  bookId,
  bookSlug,
  chapters,
  isUserAuthor,
  isUserEditor,
}: {
  bookId: string;
  bookSlug: string;
  chapters: any;
  isUserAuthor: boolean;
  isUserEditor: boolean;
}) {
  const { getToken } = useAuth();
  const router = useRouter();

  const { mutate: onCreateChapter, isPending: isCreating } = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      if (!token) {
        return;
      }
      return await honoClient.community.chapters[":bookId"].$post(
        {
          param: { bookId: bookId },
          form: {},
        },
        {
          headers: { Authorization: token },
        }
      );
    },
    onSuccess: async (res) => {
      if (res?.ok) {
        const response = await res.json();

        router.push(
          `/books/${bookSlug}/${response[0].number}?chapterId=${response[0].id}`
        );
      }
    },
  });

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex w-full items-center justify-between gap-2">
        <p className="text-lg font-bold">Chapters</p>
        {(isUserEditor || isUserAuthor) && (
          <Button
            variant="outline"
            disabled={isCreating}
            className="text-xs"
            onClick={() => {
              onCreateChapter();
            }}
          >
            Add Chapter
            {isCreating ? <LoaderCircle className="animate-spin" /> : <Plus />}
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {chapters?.map((chapter: any) => (
          <div
            key={chapter.id}
            className="relative flex h-full w-full items-center justify-between"
          >
            <Link
              href={`/books/${bookSlug}/${chapter.number}?chapterId=${chapter.id}`}
              className="bg-card h-full w-full justify-end overflow-hidden rounded border p-2"
            >
              <p className="text-sm text-gray-400">Chapter {chapter.number}</p>
              {chapter.title && (
                <p className="text-lg font-bold capitalize">{chapter.title}</p>
              )}
            </Link>
            {isUserAuthor && <DeleteChapter chapterId={chapter.id} />}
          </div>
        ))}
      </div>
    </div>
  );
}

function DeleteChapter({ chapterId }: { chapterId: number }) {
  const { getToken } = useAuth();
  const router = useRouter();
  const { openModal } = useModal();

  const { mutate: onDeleteChapter, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      if (!token) {
        return;
      }
      return await honoClient.community.chapters[":chapterId"].$delete(
        {
          param: { chapterId: chapterId.toString() },
        },
        {
          headers: { Authorization: token },
        }
      );
    },
    onError: () => {
      toast.error("Error deleting chapter");
    },
    onSuccess: async (res) => {
      if (res?.ok) {
        toast.success(`Deleted chapter`);
        router.refresh();
      }
    },
  });

  return (
    <Button
      variant="destructive"
      className="absolute top-0 right-2 bottom-0 m-auto w-fit cursor-pointer"
      disabled={isDeleting}
      onClick={() => {
        openModal({
          modalName: "WarningModal",
          props: {
            title: "Deleting chapter",
            description: "Are you sure you want to delete this chapter",
            onContinue: async () => {
              onDeleteChapter();
            },
          },
        });
      }}
    >
      {isDeleting ? <LoaderCircle className="animate-spin" /> : <Trash />}
    </Button>
  );
}
