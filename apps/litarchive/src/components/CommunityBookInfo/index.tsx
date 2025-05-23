"use client";

import Contenteditable from "@/components/Contenteditable";
import { CommunityBook, Genre } from "@/types";
import Genres from "@/components/Genres";
import { useMutation } from "@tanstack/react-query";
import honoClient from "@/app/honoRPCClient";
import { useAuth } from "@clerk/nextjs";
import { Switch } from "../ui/switch";
import { useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useModal } from "@/providers/ModalProvider";
import { CollaboratorEditor } from "../CollaboratorEditor";
import { Trash } from "lucide-react";

export default function CommunityBookInfo({
  book,
  genres,
}: {
  book: CommunityBook;
  genres: Genre[] | undefined;
}) {
  const router = useRouter();
  const { getToken } = useAuth();
  const { openModal } = useModal();

  const [isPublic, setIsPublic] = useState<boolean>(book.isPublic || false);
  const { mutate: onUpdateTitleAndDescription } = useMutation({
    mutationFn: async ({
      title,
      description,
      isPublic,
    }: {
      title?: string;
      description?: string;
      isPublic?: string;
    }) => {
      try {
        const token = await getToken();
        await honoClient.community.books[":bookId"].$put(
          {
            form: {
              ...(title && { title: title }),
              ...(description && { description: description }),
              ...(isPublic && { isPublic: isPublic }),
            },
            param: {
              bookId: book.id.toString(),
            },
          },
          {
            headers: { ...(token && { Authorization: token }) },
          }
        );
      } catch (error) {
        console.error("Error updating book:", error);
      }
    },
  });
  const { mutate: onDeleteBook } = useMutation({
    mutationFn: async () => {
      try {
        const token = await getToken();
        await honoClient.community.books[":bookId"].$delete(
          {
            param: {
              bookId: book.id.toString(),
            },
          },
          {
            headers: { ...(token && { Authorization: token }) },
          }
        );
      } catch (error) {
        console.error("Error deleting book:", error);
      }
    },
    onSuccess: () => {
      router.push("/studio");
    },
  });

  return (
    <div className="flex w-full flex-col items-start justify-between gap-4 md:flex-row">
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex w-full flex-col items-start gap-1">
          <Contenteditable
            contenteditable={!!book.isUserAuthor}
            onBlur={(e) => {
              onUpdateTitleAndDescription({ title: e.target.innerText });
            }}
            text={book.title}
            className="before:text-foreground/50 h-min min-h-0 w-full text-2xl font-bold capitalize before:pointer-events-none empty:before:content-['Title...'] focus-visible:outline-none"
            placeholder="Title..."
          />

          <p className="cursor-pointer text-gray-400 hover:underline">
            {book.user?.firstName + " " + book.user?.lastName}
          </p>

          {!!book.isUserAuthor && (
            <div className="flex items-center gap-2">
              <Switch
                checked={isPublic}
                onCheckedChange={(value) => {
                  setIsPublic(value);
                  onUpdateTitleAndDescription({ isPublic: value.toString() });
                }}
              />
              <Badge variant="outline" className="text-xs">
                {isPublic ? "Public" : "Private"}
              </Badge>
            </div>
          )}
        </div>

        <Genres
          genres={genres}
          bookId={book.id}
          isUserEditor={!!book.isUserAuthor}
        />

        <div className="flex w-full flex-col gap-1">
          <p className="font-bold">Description</p>
          <Contenteditable
            contenteditable={!!book.isUserAuthor}
            onBlur={(e) => {
              onUpdateTitleAndDescription({ description: e.target.innerText });
            }}
            text={book.description || undefined}
            className="text-sm text-gray-400"
            placeholder="Description..."
          />
        </div>
      </div>
      <div className="flex flex-row flex-wrap items-end gap-2 md:flex-col">
        {!!book.isUserAuthor || !!book.isUserEditor || !!book.isUserViewer ? (
          <CollaboratorEditor
            collaborators={book.collaborators}
            bookId={book.id}
            isUserAuthor={!!book.isUserAuthor}
          />
        ) : null}
        {!!book.isUserAuthor && (
          <Button
            className="w-fit cursor-pointer"
            variant="destructive"
            onClick={() => {
              openModal({
                modalName: "WarningModal",
                props: {
                  title: "Deleting book",
                  description: "Are you sure you want to delete this book?",
                  onContinue: async () => {
                    onDeleteBook();
                  },
                },
              });
            }}
          >
            Delete Book <Trash />
          </Button>
        )}
      </div>
    </div>
  );
}
