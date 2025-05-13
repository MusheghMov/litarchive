import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex w-full flex-col gap-10">
          <Skeleton className="h-12 w-[65%] rounded" />
          <div className="flex flex-col gap-4">
            {new Array(40).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-6 w-full rounded" />
            ))}
          </div>
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
