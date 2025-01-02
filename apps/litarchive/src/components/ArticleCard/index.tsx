"use client";

import { Button } from "../ui/button";
import { Article } from "@/types";
import { useRouter } from "next/navigation";

export default function ArticleCard({ article }: { article: Article }) {
  const router = useRouter();
  return (
    <div
      className="flex-3 flex h-fit w-full cursor-pointer flex-col items-start gap-3 self-center rounded-lg border p-4 hover:border-primary/60"
      onClick={() => {
        router.push(`/articles/${article.slug}`);
      }}
    >
      <div className="flex flex-row gap-1">
        {article?.tags?.split(" ").map((tag: string) => {
          return (
            <Button
              key={tag}
              className="h-min w-min rounded border bg-main p-1 text-xs capitalize text-foreground hover:bg-accent"
            >
              {tag.split("_").join(" ")}
            </Button>
          );
        })}
      </div>
      <div className="flex w-full flex-col gap-1">
        <p className="line-clamp-1 w-full text-xl font-semibold">
          {article.title}
        </p>
        <p className="line-clamp-3 text-xs text-foreground/70">
          {article.description}
        </p>
      </div>
      {article.createdAt && (
        <p className="self-end text-xs text-foreground/70">
          {new Date(article.createdAt!).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>
      )}
    </div>
  );
}
