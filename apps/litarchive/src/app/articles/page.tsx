import { Metadata } from "next";
import ArticleCard from "@/components/ArticleCard";
import honoClient from "../honoRPCClient";

export const metadata: Metadata = {
  title: "Articles - Writing Tips, Publishing Guides & Literary Insights",
  description: "Explore articles about writing, publishing, and storytelling. Get expert tips, industry insights, and practical guides to improve your craft and grow your audience on LitArchive.",
  keywords: [
    "writing articles",
    "publishing guides", 
    "storytelling tips",
    "author advice",
    "writing techniques",
    "literary insights",
    "creative writing",
    "publishing industry"
  ],
  openGraph: {
    title: "Articles - Writing Tips, Publishing Guides & Literary Insights",
    description: "Explore articles about writing, publishing, and storytelling. Get expert tips and practical guides to improve your craft.",
    url: "https://litarchive.com/articles",
    type: "website",
  },
  twitter: {
    title: "Articles - Writing Tips & Publishing Guides",
    description: "Explore articles about writing, publishing, and storytelling. Get expert tips to improve your craft."
  },
  alternates: {
    canonical: "/articles",
  },
};
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
