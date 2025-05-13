"use client";

import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import { Color } from "@tiptap/extension-color";
import suggestion from "./suggestion";
import Highlight from "@tiptap/extension-highlight";
import {
  BubbleMenu,
  Editor,
  EditorContent,
  FloatingMenu,
  useEditor,
} from "@tiptap/react";
import Typography from "@tiptap/extension-typography";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Mention from "@tiptap/extension-mention";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import StarterKit from "@tiptap/starter-kit";
import React, { useEffect, useMemo } from "react";
import { Button } from "../ui/button";
import {
  Bold,
  Code,
  CornerDownRight,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Italic,
  LayoutList,
  List,
  Pilcrow,
  Redo,
  SeparatorHorizontal,
  SquareTerminal,
  Strikethrough,
  TextQuote,
  Undo,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import honoClient from "@/app/honoRPCClient";
import { useUser } from "@clerk/nextjs";

export default function TiptapEditor({
  editable,
  onUpdate,
  content,
  saved = true,
  id,
}: {
  editable: boolean;
  onUpdate?: ({ editor }: { editor: Editor }) => void;
  content?: string;
  saved?: boolean;
  id?: string;
}) {
  const { user } = useUser();

  const ydoc = useMemo(() => new Y.Doc(), []);
  const room = `room.${id}`;

  const provider = useMemo(() => {
    const url = honoClient.editor[":id"].$url();
    return new WebsocketProvider(
      url.toString().replace("http", "ws").replace("/:id", ""),
      room,
      ydoc
    );
  }, [ydoc]);

  const editor = useEditor({
    enableContentCheck: true,
    onContentError: ({ disableCollaboration }) => {
      disableCollaboration();
    },
    onCreate: ({ editor: currentEditor }) => {
      if (!provider) {
        return;
      }
      provider.on("sync", () => {
        if (currentEditor.isEmpty) {
          currentEditor.commands.setContent(content || "");
        }
      });
    },
    editable: editable,
    immediatelyRender: false,
    onUpdate: onUpdate,
    extensions: [
      Collaboration.extend().configure({
        document: ydoc,
      }),
      CollaborationCursor.extend().configure({
        provider,
        user: {
          name: user?.firstName,
          color: "#958DF1",
        },
      }),
      Highlight,
      Typography,
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Mention.configure({
        HTMLAttributes: {
          class: "mention",
        },
        // @ts-ignore
        suggestion,
        deleteTriggerWithBackspace: true,
      }),
      Placeholder.configure({
        placeholder: "Write something …",
      }),
      TextStyle,
      StarterKit,
    ],
  });

  useEffect(() => {
    if (!provider) {
      return;
    }

    const statusHandler = (event: any) => {
      console.log("status:", event);
    };

    provider.on("status", statusHandler);

    return () => {
      provider.off("status", statusHandler);
    };
  }, [provider]);

  if (!provider || !editor) {
    return null;
  }

  return (
    <div className="flex h-full w-full flex-col gap-10">
      <div
        className={cn(
          "bg-background sticky top-16 z-10 flex w-fit flex-col-reverse justify-end gap-2 lg:flex-row-reverse",
          !editor.isEditable && "hidden"
        )}
      >
        {editor.isEditable && (
          <div>
            <div className="flex flex-wrap gap-2 rounded border p-2">
              <Button
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={cn(
                  "cursor-pointer",
                  editor.isActive("bold") &&
                    "bg-foreground text-background hover:!bg-foreground hover:text-background"
                )}
                variant="ghost"
              >
                <Bold />
              </Button>
              <Button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={cn(
                  "cursor-pointer",
                  editor.isActive("italic") &&
                    "bg-foreground text-background hover:!bg-foreground hover:text-background"
                )}
                variant="ghost"
              >
                <Italic />
              </Button>
              <Button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                disabled={!editor.can().chain().focus().toggleStrike().run()}
                className={cn(
                  "cursor-pointer",
                  editor.isActive("strike") &&
                    "bg-foreground text-background hover:!bg-foreground hover:text-background"
                )}
                variant="ghost"
              >
                <Strikethrough />
              </Button>
              <Separator orientation="vertical" className="h-auto" />
              <Button
                onClick={() => editor.chain().focus().setParagraph().run()}
                className={cn(
                  "cursor-pointer",
                  editor.isActive("paragraph") &&
                    "bg-foreground text-background hover:!bg-foreground hover:text-background"
                )}
                variant="ghost"
              >
                <Pilcrow />
              </Button>
              <Button
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
                className={cn(
                  "cursor-pointer",
                  editor.isActive("heading", { level: 1 }) &&
                    "bg-foreground text-background hover:!bg-foreground hover:text-background"
                )}
                variant="ghost"
              >
                <Heading1 />
              </Button>
              <Button
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
                className={cn(
                  "cursor-pointer",
                  editor.isActive("heading", { level: 2 }) &&
                    "bg-foreground text-background hover:!bg-foreground hover:text-background"
                )}
                variant="ghost"
              >
                <Heading2 />
              </Button>
              <Button
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
                className={cn(
                  "cursor-pointer",
                  editor.isActive("heading", { level: 3 }) &&
                    "bg-foreground text-background hover:!bg-foreground hover:text-background"
                )}
                variant="ghost"
              >
                <Heading3 />
              </Button>
              <Button
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 4 }).run()
                }
                className={cn(
                  "cursor-pointer",
                  editor.isActive("heading", { level: 4 }) &&
                    "bg-foreground text-background hover:!bg-foreground hover:text-background"
                )}
                variant="ghost"
              >
                <Heading4 />
              </Button>
              <Button
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 5 }).run()
                }
                className={cn(
                  "cursor-pointer",
                  editor.isActive("heading", { level: 5 }) &&
                    "bg-foreground text-background hover:!bg-foreground hover:text-background"
                )}
                variant="ghost"
              >
                <Heading5 />
              </Button>
              <Button
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 6 }).run()
                }
                className={cn(
                  "cursor-pointer",
                  editor.isActive("heading", { level: 6 }) &&
                    "bg-foreground text-background hover:!bg-foreground hover:text-background"
                )}
                variant="ghost"
              >
                <Heading6 />
              </Button>
              <Separator orientation="vertical" className="h-auto" />
              <Button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={cn(
                  "cursor-pointer",
                  editor.isActive("bulletList") &&
                    "bg-foreground text-background hover:!bg-foreground hover:text-background"
                )}
                variant="ghost"
              >
                <List />
              </Button>
              <Button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={cn(
                  "cursor-pointer",
                  editor.isActive("orderedList") &&
                    "bg-foreground text-background hover:!bg-foreground hover:text-background"
                )}
                variant="ghost"
              >
                <LayoutList />
              </Button>
              <Separator orientation="vertical" className="h-auto" />

              <Button
                onClick={() => editor.chain().focus().toggleCode().run()}
                disabled={!editor.can().chain().focus().toggleCode().run()}
                className={cn(
                  "cursor-pointer",
                  editor.isActive("code") &&
                    "bg-foreground text-background hover:!bg-foreground hover:text-background"
                )}
                variant="ghost"
              >
                <Code />
              </Button>
              <Button
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={cn(
                  "cursor-pointer",
                  editor.isActive("codeBlock") &&
                    "bg-foreground text-background hover:!bg-foreground hover:text-background"
                )}
                variant="ghost"
              >
                <SquareTerminal />
              </Button>
              <Button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={cn(
                  "cursor-pointer",
                  editor.isActive("blockquote") &&
                    "bg-foreground text-background hover:!bg-foreground hover:text-background"
                )}
                variant="ghost"
              >
                <TextQuote />
              </Button>
              <Separator orientation="vertical" className="h-auto" />
              <Button
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                className="cursor-pointer"
                variant="ghost"
              >
                <SeparatorHorizontal />
              </Button>
              <Button
                onClick={() => editor.chain().focus().setHardBreak().run()}
                className="cursor-pointer"
                variant="ghost"
              >
                <CornerDownRight />
              </Button>
              <Separator orientation="vertical" className="h-auto" />
              <Button
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
                className="cursor-pointer"
                variant="ghost"
              >
                <Undo />
              </Button>
              <Button
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
                className="cursor-pointer"
                variant="ghost"
              >
                <Redo />
              </Button>

              <Badge
                variant="outline"
                className={cn(
                  "h-fit self-end text-xs lg:self-center",
                  saved && "text-background bg-green-400"
                )}
              >
                {saved ? "Saved" : "Not Saved"}
              </Badge>
            </div>
            <FloatingMenu
              className="bubble-menu"
              tippyOptions={{ duration: 100, placement: "bottom" }}
              editor={editor}
            >
              <div className="bg-background flex flex-wrap items-center gap-2 rounded border p-2 shadow-md">
                <Button
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  disabled={!editor.can().chain().focus().toggleBold().run()}
                  className={cn(
                    "cursor-pointer",
                    editor.isActive("bold") &&
                      "bg-foreground text-background hover:!bg-foreground hover:text-background"
                  )}
                  variant="ghost"
                >
                  <Bold />
                </Button>
                <Button
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  disabled={!editor.can().chain().focus().toggleItalic().run()}
                  className={cn(
                    "cursor-pointer",
                    editor.isActive("italic") &&
                      "bg-foreground text-background hover:!bg-foreground hover:text-background"
                  )}
                  variant="ghost"
                >
                  <Italic />
                </Button>
                <Button
                  onClick={() => editor.chain().focus().toggleStrike().run()}
                  disabled={!editor.can().chain().focus().toggleStrike().run()}
                  className={cn(
                    "cursor-pointer",
                    editor.isActive("strike") &&
                      "bg-foreground text-background hover:!bg-foreground hover:text-background"
                  )}
                  variant="ghost"
                >
                  <Strikethrough />
                </Button>
                <div className="text-muted-foreground ml-6 grid items-end gap-1 text-xs">
                  <p>
                    move:{" "}
                    <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 w-fit items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
                      <span className="text-xs">TAB</span>
                    </kbd>
                  </p>
                  <p>
                    select:{" "}
                    <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 w-fit items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
                      <span className="text-xs">SPACE</span>
                    </kbd>
                  </p>
                </div>
              </div>
            </FloatingMenu>
            <BubbleMenu
              className="bubble-menu"
              tippyOptions={{ duration: 100 }}
              editor={editor}
            >
              <div className="bg-background flex flex-wrap gap-2 rounded border p-2 shadow-md">
                <Button
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  disabled={!editor.can().chain().focus().toggleBold().run()}
                  className={cn(
                    "cursor-pointer",
                    editor.isActive("bold") &&
                      "bg-foreground text-background hover:!bg-foreground hover:text-background"
                  )}
                  variant="ghost"
                >
                  <Bold />
                </Button>
                <Button
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  disabled={!editor.can().chain().focus().toggleItalic().run()}
                  className={cn(
                    "cursor-pointer",
                    editor.isActive("italic") &&
                      "bg-foreground text-background hover:!bg-foreground hover:text-background"
                  )}
                  variant="ghost"
                >
                  <Italic />
                </Button>
                <Button
                  onClick={() => editor.chain().focus().toggleStrike().run()}
                  disabled={!editor.can().chain().focus().toggleStrike().run()}
                  className={cn(
                    "cursor-pointer",
                    editor.isActive("strike") &&
                      "bg-foreground text-background hover:!bg-foreground hover:text-background"
                  )}
                  variant="ghost"
                >
                  <Strikethrough />
                </Button>
              </div>
            </BubbleMenu>
          </div>
        )}
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
