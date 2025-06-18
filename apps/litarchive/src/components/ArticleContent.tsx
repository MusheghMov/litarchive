"use client";

import { useState } from "react";
import ReadOnlyTiptapEditor from "./ReadonlyTiptapEditor";
import { Badge } from "./ui/badge";

export default function ArticleContent({
	title,
	content,
	description,
	date,
}: { title: string; content: string; description: string; date: string }) {
	const [wordCount, setWordCount] = useState();
	return (
		<article className="prose not-light:prose-invert self-center">
			<h1 className="!mb-0">{title}</h1>
			<div className="w-full flex justify-between items-center">
				<p className="text-foreground/70 text-xs">updated at: {date}</p>
				{wordCount && <Badge>{wordCount} words</Badge>}
			</div>
			<span className="text-[17px] italic">
				<ReadOnlyTiptapEditor content={description} />
			</span>
			<ReadOnlyTiptapEditor
				content={content}
				onCreate={(editor) => {
					setWordCount(editor.editor.storage.characterCount.words());
				}}
			/>
		</article>
	);
}
