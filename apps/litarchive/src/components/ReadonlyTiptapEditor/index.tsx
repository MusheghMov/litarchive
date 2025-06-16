"use client";

import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { TableKit } from "@tiptap/extension-table";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { all, createLowlight } from "lowlight";

const lowlight = createLowlight(all);
lowlight.registered("javascript");

export default function ReadOnlyTiptapEditor({ content }: { content: string }) {
	const editor = useEditor({
		extensions: [
			StarterKit,
			TableKit.configure({
				table: { resizable: true },
			}),
			CodeBlockLowlight.configure({
				lowlight,
				defaultLanguage: "vbnet",
				languageClassPrefix: "language-",
			}),
		],
		content: content,
		editable: false,
		immediatelyRender: false,
	});

	return <EditorContent editor={editor} />;
}
