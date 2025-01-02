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
    <div className="mt-8 flex w-full flex-col items-start gap-6 self-center px-4 md:px-8 lg:max-w-[80%] lg:p-0 lg:py-8">
      <article className="prose flex w-full min-w-full flex-col items-start justify-center gap-0 whitespace-pre-wrap text-foreground/90 dark:prose-invert lg:prose-xl prose-headings:text-foreground lg:px-24">
        <div>
          <h1 className="!mb-0">{article.title}</h1>
          <p className="text-xs text-foreground/70">
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
    </div>
  );
}
