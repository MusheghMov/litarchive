import honoClient from "@/app/honoRPCClient";
import ArticleContent from "@/components/ArticleContent";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ articleSlug: string }>;
}) {
  const { articleSlug } = await params;

  const res = await honoClient.articles[":slug"].$get({
    param: { slug: articleSlug },
  });

  if (!res.ok) {
    console.error("error: ", res);
    return null;
  }

  const article = await res.json();

  if (!article) {
    return <p>no article found</p>;
  }

  return (
    <article className="prose text-foreground/90 dark:prose-invert lg:prose-xl prose-headings:text-foreground flex w-full min-w-full flex-col items-start justify-center gap-0 whitespace-pre-wrap lg:px-24">
      <div>
        <h1 className="!mb-0">{article.title}</h1>
        <p className="text-foreground/70 text-xs">
          updated at:{" "}
          {new Date(article.updatedAt!).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>
      </div>
      <p className="text-[17px] italic">{article.description}</p>
      <ArticleContent content={article.content} />
    </article>
  );
}
