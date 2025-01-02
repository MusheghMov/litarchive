import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export default function PageButtons({
  pagesCount,
  pageNumber,
  bookId,
}: {
  pagesCount: number;
  pageNumber: number;
  bookId: number;
}) {
  const router = useRouter();
  return (
    <div className="sticky top-16 flex w-full flex-row justify-between gap-4 opacity-70 hover:opacity-100">
      <Button
        variant="outline"
        className={cn(
          "left-0 cursor-pointer capitalize",
          pageNumber === 1 && "cursor-not-allowed"
        )}
        disabled={pageNumber === 1}
        onClick={() => {
          if (pageNumber === 1) return;
          router.push(`/books/${bookId}?page=${pageNumber - 1}`);
        }}
      >
        prev
      </Button>
      <Button
        className="capitalize"
        variant="outline"
        onClick={() => {
          if (pageNumber + 1 > pagesCount) return;
          router.push(`/books/${bookId}?page=${pageNumber + 1}`);
        }}
        disabled={pageNumber + 1 > pagesCount}
      >
        next
      </Button>
    </div>
  );
}
