import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mt-8 flex w-full flex-col items-start gap-4 self-center px-4 md:px-8 lg:mt-14 lg:max-w-[1000px] lg:p-0">
      <Suspense
        fallback={
          <div className="grid w-full grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {new Array(12).fill(0).map((_, i) => (
              <Skeleton key={i} className="aspect-[9/13] w-full rounded" />
            ))}
          </div>
        }
      >
        {children}
      </Suspense>
    </div>
  );
}
