"use client";

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import honoClient from "@/app/honoRPCClient";
import { useAuth } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UpsertAuthorReviewModal({
  author,
  initialReview,
  setIsOpen,
}: any) {
  const { userId } = useAuth();
  const router = useRouter();
  const [review, setReview] = useState(initialReview);

  const onHandleReviewUpdate = async (review: string) => {
    await honoClient.ratings["authors"][":authorId"].$post(
      {
        param: {
          authorId: author?.id,
        },
        json: {
          review: review,
        },
      },
      {
        headers: userId ? { Authorization: userId } : undefined,
      }
    );
  };

  const { mutate: updateRreviewMutation, isPending: isReviewPending } =
    useMutation({
      mutationFn: onHandleReviewUpdate,
    });
  return (
    <DialogContent
      onClick={(e) => {
        e.stopPropagation();
      }}
      className="md:min-w-[500px] md:p-8"
    >
      <DialogHeader>
        <DialogTitle>Your review for {author?.name}</DialogTitle>
        <DialogDescription>
          Add your review for {author?.name} to help other users know what you
          think about this author
        </DialogDescription>
      </DialogHeader>
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          updateRreviewMutation(e.currentTarget.review.value, {
            onSuccess: () => {
              setIsOpen(false);
              router.refresh();
            },
          });
        }}
      >
        <textarea
          id="review"
          name="review"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          className="min-h-[200px] w-full rounded-lg border border-foreground/50 bg-background/5 p-2 text-sm backdrop-blur-lg"
          placeholder="Add your review"
        />
        <div className="flex w-full justify-end gap-2">
          <Button
            variant="secondary"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setIsOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isReviewPending} className="text-background">
            Submit
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}
