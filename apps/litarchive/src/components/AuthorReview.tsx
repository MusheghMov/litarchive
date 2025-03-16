"use client";

import { Button } from "@/components/ui/button";
import { useModal } from "@/providers/ModalProvider";
import { useAuth } from "@clerk/nextjs";

export default function AuthorReview({ author }: { author: any }) {
  const { openModal } = useModal();
  const { isSignedIn } = useAuth();
  return (
    <div className="flex flex-col items-start gap-1 lg:max-w-[250px]">
      <div className="flex w-full items-center justify-between gap-2">
        <p className="text-base font-medium capitalize">your review</p>
        <Button
          variant="link"
          onClick={() => {
            if (!isSignedIn) {
              openModal({
                modalName: "SignUpSuggestionModal",
              });
              return;
            }
            openModal({
              modalName: "UpsertAuthorReviewModal",
              props: {
                author,
                initialReview: author?.userReview,
              },
            });
          }}
        >
          {author?.userReview ? "edit" : "add"} review
        </Button>
      </div>
      {author?.userReview ? (
        <p className="line-clamp-5 text-sm text-foreground/50">
          {author?.userReview}
        </p>
      ) : (
        <p className="line-clamp-3 text-sm text-foreground/50">no review yet</p>
      )}
    </div>
  );
}
