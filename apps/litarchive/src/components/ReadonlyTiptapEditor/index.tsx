"use client";

import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { TableKit } from "@tiptap/extension-table";
import { CharacterCount } from "@tiptap/extensions";
import { EditorContent, type EditorEvents, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { all, createLowlight } from "lowlight";

const lowlight = createLowlight(all);
lowlight.registered("javascript");

export default function ReadOnlyTiptapEditor({
	content,
	onCreate,
}: {
	content: string;
	onCreate?: ((props: EditorEvents["create"]) => void) | undefined;
}) {
	const editor = useEditor({
		extensions: [
			StarterKit,
			CharacterCount,
			TableKit.configure({
				table: { resizable: true },
			}),
			CodeBlockLowlight.configure({
				lowlight,
				defaultLanguage: "vbnet",
				languageClassPrefix: "language-",
			}),
		],
		onCreate: onCreate,
		content: content,
		editable: false,
		immediatelyRender: false,
	});

	return <EditorContent editor={editor} />;
}
