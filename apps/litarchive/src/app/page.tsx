import Hero from "@/components/Hero";
import { Suspense } from "react";
import RecommendedBooks from "@/components/RecommendedBooks";
import RecommendedArticles from "@/components/RecommendedArticles";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="relative flex h-max w-full flex-col">
      <Hero />
      <div className="flex w-full max-w-[1200px] flex-col space-y-16 self-center px-4 py-16 lg:px-10">
        <Suspense
          fallback={
            <div className="flex h-32 w-full items-center justify-center">
              <Loader2 className="animate-spin" size={40} />
            </div>
          }
        >
          <RecommendedBooks />
        </Suspense>
        
        <Suspense
          fallback={
            <div className="flex h-32 w-full items-center justify-center">
              <Loader2 className="animate-spin" size={40} />
            </div>
          }
        >
          <RecommendedArticles />
        </Suspense>
      </div>
    </div>
  );
}
