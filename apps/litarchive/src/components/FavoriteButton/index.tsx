"use client";

import { Star } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useAuth, useUser } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import honoClient from "@/app/honoRPCClient";
import { useModal } from "@/providers/ModalProvider";

export default function FavoriteButton({
  isLiked,
  bookId,
}: {
  isLiked?: boolean;
  bookId: number;
}) {
  const { isSignedIn } = useUser();
  const { userId } = useAuth();
  const { openModal } = useModal();
  const [isBookLiked, setIsBookLiked] = useState(isLiked);

  const { mutate: onLikeBook } = useMutation({
    mutationKey: ["addBoookToUserLikedBooks"],
    mutationFn: async (bookId: number) => {
      if (!userId) {
        return;
      }
      setIsBookLiked(true);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await honoClient.books["like"].$post(
        {
          query: {
            bookId: bookId.toString(),
          },
        },
        {
          headers: { Authorization: `${userId}` },
        }
      );
    },
  });
  const { mutate: onUnlikeBook } = useMutation({
    mutationKey: ["removeBoookFromUserLikedBooks"],
    mutationFn: async (bookId: number) => {
      if (!userId) {
        return;
      }
      setIsBookLiked(false);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await honoClient.books["dislike"].$post(
        {
          query: {
            bookId: bookId.toString(),
          },
        },
        {
          headers: { Authorization: `${userId}` },
        }
      );
    },
  });

  return (
    <Button
      className="group h-fit w-fit rounded-full border-primary/40 bg-background p-2 hover:bg-background/30 active:scale-125 active:border-primary"
      variant="outline"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isSignedIn) {
          openModal({
            modalName: "SignUpSuggestionModal",
          });
          return;
        }
        if (isBookLiked) {
          onUnlikeBook(bookId);
        } else {
          onLikeBook(bookId);
        }
      }}
    >
      <Star
        size={16}
        className={cn(
          "stroke-primary/70 group-active:stroke-primary",
          isBookLiked && "fill-primary/70"
        )}
      />
    </Button>
  );
}
