"use client";

import { useState } from "react";
import { Rating as ReactRating, StickerStar } from "@smastrom/react-rating";
import { useMutation } from "@tanstack/react-query";
import honoClient from "@/app/honoRPCClient";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useModal } from "@/providers/ModalProvider";

export default function Rating({
  initialRating,
  authorId,
  userId,
}: {
  initialRating?: number;
  authorId: string;
  userId?: string;
}) {
  const { isSignedIn } = useUser();
  const { openModal } = useModal();
  const [rating, setRating] = useState(initialRating || 0);
  const router = useRouter();

  const onHandleRatingUpdate = async (rating: number) => {
    const res = await honoClient.ratings["authors"][":authorId"].$post(
      {
        param: {
          authorId: authorId,
        },
        json: {
          rating: rating,
        },
      },
      {
        headers: userId ? { Authorization: userId } : undefined,
      }
    );
  };
  const { mutate: updateRatingMutation } = useMutation({
    mutationFn: onHandleRatingUpdate,
  });

  return (
    <ReactRating
      className="w-full"
      style={{ width: "100%", maxWidth: "250px" }}
      value={rating}
      onChange={(newRating: number) => {
        if (!isSignedIn) {
          openModal({
            modalName: "SignUpSuggestionModal",
          });
          return;
        }
        setRating(newRating);
        updateRatingMutation(newRating, {
          onSuccess: (a) => {
            router.refresh();
          },
        });
      }}
      itemStyles={{
        itemShapes: StickerStar,
        activeFillColor: "#f59e0b",
        inactiveFillColor: "#ffedd5",
      }}
    />
  );
}
