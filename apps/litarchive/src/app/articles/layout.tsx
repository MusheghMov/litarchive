import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default function ArticlesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mt-8 flex w-full flex-col items-start gap-4 self-center px-4 md:px-8 lg:mt-14 lg:max-w-[1000px] lg:p-0">
      <Suspense
        fallback={
          <>
            <Skeleton className="h-9 w-[140px]" />
            <div className="grid w-full flex-1 auto-rows-max place-items-center gap-4 lg:grid-cols-2">
              {new Array(6).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-[180px] w-full rounded-lg" />
              ))}
            </div>
          </>
        }
      >
        {children}
      </Suspense>
    </div>
  );
}
