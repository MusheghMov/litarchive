import ArticleCard from "@/components/ArticleCard";
import honoClient from "../honoRPCClient";
export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ search: string }>;
}) {
  const { search } = await searchParams;
  let articles;
  try {
    const res = await honoClient.articles.$get({
      query: {
        search: search || "",
      },
    });
    if (res.ok) {
      articles = await res.json();
    }
  } catch (error) {
    console.error("Error fetching articles:", error);
  }

  if (!articles) {
    return <div>No articles found</div>;
  }

  return (
    <div className="grid w-full flex-1 auto-rows-max place-items-center gap-4 lg:grid-cols-2">
      {articles.map((article) => {
        return <ArticleCard article={article} key={article.id} />;
      })}
    </div>
  );
}
