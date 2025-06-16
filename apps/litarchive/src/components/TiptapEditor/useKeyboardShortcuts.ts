import type { Editor } from "@tiptap/react";
import { useCallback, useEffect, useMemo } from "react";

interface KeyboardShortcut {
	key: string;
	meta?: boolean;
	ctrl?: boolean;
	shift?: boolean;
	alt?: boolean;
	description: string;
	action: () => void;
}

export const useKeyboardShortcuts = (editor: Editor | null) => {
	const shortcuts = useMemo((): KeyboardShortcut[] => {
		if (!editor) return [];

		return [
			{
				key: "b",
				meta: true,
				ctrl: true,
				description: "Bold",
				action: () => editor.chain().focus().toggleBold().run(),
			},
			{
				key: "i",
				meta: true,
				ctrl: true,
				description: "Italic",
				action: () => editor.chain().focus().toggleItalic().run(),
			},
			{
				key: "u",
				meta: true,
				ctrl: true,
				description: "Underline",
				action: () => editor.chain().focus().toggleStrike().run(),
			},
			{
				key: "k",
				meta: true,
				ctrl: true,
				description: "Code",
				action: () => editor.chain().focus().toggleCode().run(),
			},
			{
				key: "e",
				meta: true,
				ctrl: true,
				description: "Code Block",
				action: () => editor.chain().focus().toggleCodeBlock().run(),
			},
			{
				key: "q",
				meta: true,
				ctrl: true,
				description: "Quote",
				action: () => editor.chain().focus().toggleBlockquote().run(),
			},
			{
				key: "1",
				meta: true,
				ctrl: true,
				description: "Heading 1",
				action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
			},
			{
				key: "2",
				meta: true,
				ctrl: true,
				description: "Heading 2",
				action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
			},
			{
				key: "3",
				meta: true,
				ctrl: true,
				description: "Heading 3",
				action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
			},
			{
				key: "0",
				meta: true,
				ctrl: true,
				description: "Paragraph",
				action: () => editor.chain().focus().setParagraph().run(),
			},
			{
				key: "l",
				meta: true,
				ctrl: true,
				shift: true,
				description: "Bullet List",
				action: () => editor.chain().focus().toggleBulletList().run(),
			},
			{
				key: "o",
				meta: true,
				ctrl: true,
				shift: true,
				description: "Ordered List",
				action: () => editor.chain().focus().toggleOrderedList().run(),
			},
		];
	}, [editor]);

	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (!editor?.isFocused || shortcuts.length === 0) return;

			const shortcut = shortcuts.find((s) => {
				const metaMatch = s.meta
					? e.metaKey || e.ctrlKey
					: !e.metaKey && !e.ctrlKey;
				const ctrlMatch = s.ctrl ? e.ctrlKey : !s.ctrl;
				const shiftMatch = s.shift ? e.shiftKey : !e.shiftKey;
				const altMatch = s.alt ? e.altKey : !e.altKey;

				return (
					s.key.toLowerCase() === e.key.toLowerCase() &&
					metaMatch &&
					shiftMatch &&
					altMatch
				);
			});

			if (shortcut) {
				e.preventDefault();
				shortcut.action();
			}
		},
		[editor, shortcuts],
	);

	useEffect(() => {
		if (shortcuts.length === 0) return;

		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [handleKeyDown, shortcuts.length]);

	const getShortcuts = (): KeyboardShortcut[] => [
		{ key: "b", meta: true, ctrl: true, description: "Bold", action: () => {} },
		{
			key: "i",
			meta: true,
			ctrl: true,
			description: "Italic",
			action: () => {},
		},
		{
			key: "u",
			meta: true,
			ctrl: true,
			description: "Strikethrough",
			action: () => {},
		},
		{ key: "k", meta: true, ctrl: true, description: "Code", action: () => {} },
		{
			key: "e",
			meta: true,
			ctrl: true,
			description: "Code Block",
			action: () => {},
		},
		{
			key: "q",
			meta: true,
			ctrl: true,
			description: "Quote",
			action: () => {},
		},
		{
			key: "1-3",
			meta: true,
			ctrl: true,
			description: "Heading 1-3",
			action: () => {},
		},
		{
			key: "0",
			meta: true,
			ctrl: true,
			description: "Paragraph",
			action: () => {},
		},
		{
			key: "l",
			meta: true,
			ctrl: true,
			shift: true,
			description: "Bullet List",
			action: () => {},
		},
		{
			key: "o",
			meta: true,
			ctrl: true,
			shift: true,
			description: "Ordered List",
			action: () => {},
		},
	];

	return { getShortcuts };
};
