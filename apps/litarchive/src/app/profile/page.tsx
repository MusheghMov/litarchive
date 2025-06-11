import ListsList from "@/components/ListsList";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default async function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="flex w-full flex-col gap-y-4">
          <div className="flex w-full items-center justify-between gap-4">
            <Skeleton className="h-[30px] w-[100px]" />
            <Skeleton className="h-[30px] w-[100px]" />
          </div>
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {new Array(3).fill(0).map((_, i) => (
              <div className="flex flex-col gap-2" key={i}>
                <Skeleton className="h-[258px] w-full rounded" />
                <Skeleton className="h-[20px] w-[100px]" />
              </div>
            ))}
          </div>
        </div>
      }
    >
      <ListsList />
    </Suspense>
  );
}
