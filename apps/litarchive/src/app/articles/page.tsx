import ArticleCard from "@/components/ArticleCard";
import honoClient from "../honoRPCClient";

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ search: string }>;
}) {
  const { search } = await searchParams;
  const res = await honoClient.articles.$get({
    param: { search: search || "" },
  });

  if (!res.ok) {
    console.error("error: ", res);
    return null;
  }

  const articles = await res.json();

  return (
    <div className="mt-8 grid w-full flex-1 auto-rows-max place-items-center items-center justify-center gap-4 self-center px-4 md:px-8 lg:mt-14 lg:max-w-[1000px] lg:grid-cols-2 lg:p-0">
      {articles.map((article) => {
        return <ArticleCard article={article} key={article.id} />;
      })}
    </div>
  );
}
