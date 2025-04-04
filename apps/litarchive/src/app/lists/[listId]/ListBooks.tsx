"use client";

import honoClient from "@/app/honoRPCClient";
import BookCard from "@/components/BookCard";
import TooltipContainer from "@/components/TooltipContainer";
import { Button } from "@/components/ui/button";
import { List } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

export default function ListBooks({ list }: { list: List }) {
  const router = useRouter();
  const { userId } = useAuth();

  const { mutate: removeBookFromList } = useMutation({
    mutationKey: ["removeBookFromList"],
    mutationFn: async (bookId: number) => {
      await honoClient.lists[":listId"].books[":bookId"].$delete(
        {
          param: { listId: list.id.toString(), bookId: bookId.toString() },
        },
        {
          headers: { Authorization: `${userId}` },
        }
      );
    },
    onSuccess: () => {
      router.refresh();
    },
    onError: (e) => {
      console.warn("ERROR::::: ", e.message);
    },
  });

  return (
    <div className="grid w-full grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5">
      {list?.books?.map((book) => (
        <div className="relative" key={book?.id}>
          <BookCard book={book} isLiked={true} />
          <TooltipContainer tooltipContent="Remove from list">
            <Button
              variant="outline"
              className="absolute right-2 bottom-2 h-min w-min cursor-pointer rounded-full !p-2"
              onClick={(e) => {
                e.stopPropagation();
                removeBookFromList(book.id);
              }}
            >
              <X size={16} />
            </Button>
          </TooltipContainer>
        </div>
      ))}
    </div>
  );
}
