import honoClient from "@/app/honoRPCClient";
import ArticleContent from "@/components/ArticleContent";
import { Marked } from "marked";

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

	const marked = new Marked();

	const parsedContent = await marked.parse(article.content);
	const parsedDescription = await marked.parse(article?.description || "");

	const date = new Date(article.updatedAt!).toLocaleDateString(undefined, {
		year: "numeric",
		month: "short",
		day: "numeric",
	});

	return (
		<ArticleContent
			content={parsedContent}
			description={parsedDescription}
			title={article.title}
			date={date}
		/>
	);
}
