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

export default function CommunityBookInfo({
  book,
  genres,
}: {
  book: CommunityBook;
  genres: Genre[] | undefined;
}) {
  const [isPublic, setIsPublic] = useState<boolean>(book.isPublic || false);
  const { userId } = useAuth();
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
            headers: { Authorization: `${userId}` },
          }
        );
      } catch (error) {
        console.error("Error updating book:", error);
      }
    },
  });
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex w-full flex-col items-start gap-1">
        <Contenteditable
          contenteditable={!!book.isUserEditor}
          onBlur={(e) => {
            onUpdateTitleAndDescription({ title: e.target.innerText });
          }}
          text={book.title}
          className="before:text-foreground/50 h-min min-h-0 w-full text-2xl font-bold capitalize before:pointer-events-none empty:before:content-['Title...'] focus-visible:outline-none"
          placeholder="Title..."
        />

        {!!book.isUserEditor && (
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
        <p className="cursor-pointer text-gray-400 hover:underline">
          {book.user?.firstName + " " + book.user?.lastName}
        </p>
      </div>

      <Genres
        genres={genres}
        bookId={book.id}
        isUserEditor={!!book.isUserEditor}
      />

      <div className="flex w-full flex-col gap-1">
        <p className="font-bold">Description</p>
        <Contenteditable
          contenteditable={!!book.isUserEditor}
          onBlur={(e) => {
            onUpdateTitleAndDescription({ description: e.target.innerText });
          }}
          text={book.description || undefined}
          className="text-sm text-gray-400"
          placeholder="Description..."
        />
      </div>
    </div>
  );
}
