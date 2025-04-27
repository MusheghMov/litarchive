"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function ReadOnlyTiptapEditor({ content }: { content: string }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    editable: false,
    immediatelyRender: false,
  });

  return <EditorContent editor={editor} />;
}
