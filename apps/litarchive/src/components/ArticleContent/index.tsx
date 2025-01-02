"use client";

import Markdown from "react-markdown";

export default function ArticleContent({ content }: { content: string }) {
  return <Markdown>{content}</Markdown>;
}
