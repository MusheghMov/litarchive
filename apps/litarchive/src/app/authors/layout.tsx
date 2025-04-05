import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default function AuthorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full max-w-[1000px] flex-col items-start justify-between gap-2 self-center px-4 py-10 sm:p-10 lg:px-0">
      <Suspense
        fallback={
          <div className="grid w-full gap-4">
            <Input
              disabled
              className="w-full sm:w-[400px]"
              placeholder="Search for book by title or author name"
            />
            <div className="grid w-full grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {new Array(12).fill(0).map((_, i) => (
                <Skeleton key={i} className="aspect-[9/12] w-full rounded" />
              ))}
            </div>
          </div>
        }
      >
        {children}
      </Suspense>
    </div>
  );
}
