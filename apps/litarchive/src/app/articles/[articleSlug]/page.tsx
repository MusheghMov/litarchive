import honoClient from "@/app/honoRPCClient";
import Markdown from "react-markdown";

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

	const date = new Date(article.updatedAt!).toLocaleDateString(undefined, {
		year: "numeric",
		month: "short",
		day: "numeric",
	});

	return (
		<article className="prose not-light:prose-invert self-center">
			<div>
				<h1 className="!mb-0">{article.title}</h1>
				<p className="text-foreground/70 text-xs">updated at: {date}</p>
			</div>
			<p className="text-[17px] italic">{article.description}</p>
			<Markdown>{article.content}</Markdown>
		</article>
	);
}
