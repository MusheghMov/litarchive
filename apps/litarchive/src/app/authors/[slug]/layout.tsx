import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex w-full flex-col gap-10 lg:flex-row">
      <Suspense
        fallback={
          <>
            <Skeleton className="h-[400px] w-[246px]" />
            <div className="flex w-full flex-1 flex-col gap-10">
              <Skeleton className="h-[500px] w-full" />
              <div className="grid w-full grid-cols-2 gap-6 md:grid-cols-3">
                {new Array(6).fill(0).map((_, i) => (
                  <Skeleton key={i} className="aspect-[4/5] w-full rounded" />
                ))}
              </div>
            </div>
          </>
        }
      >
        {children}
      </Suspense>
    </div>
  );
}
