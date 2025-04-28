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
          <div className="flex w-full flex-col gap-4">
            <div className="flex w-full flex-col gap-4 md:flex-row">
              <Skeleton className="aspect-[2/3] w-full md:h-[400px] md:w-[300px]" />
              <Skeleton className="w-full flex-1 object-cover" />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {new Array(4).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-[100px] w-full rounded" />
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
