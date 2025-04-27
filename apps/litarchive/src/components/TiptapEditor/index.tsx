"use client";

import { Color } from "@tiptap/extension-color";
import suggestion from "./suggestion";
import Highlight from "@tiptap/extension-highlight";
import {
  BubbleMenu,
  Editor,
  // EditorContent,
  FloatingMenu,
  // useEditor,
} from "@tiptap/react";
import Typography from "@tiptap/extension-typography";
// import BulletList from "@tiptap/extension-bullet-list";
// import OrderedList from "@tiptap/extension-ordered-list";
// import HorizontalRule from "@tiptap/extension-horizontal-rule";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Mention from "@tiptap/extension-mention";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { EditorProvider, useCurrentEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React from "react";
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

const MenuBar = ({
  showEditButton,
  saved = true,
}: {
  showEditButton: boolean;
  saved?: boolean;
}) => {
  const { editor } = useCurrentEditor();
  // const [isEditable, setIsEditable] = useState(false);

  if (!editor) {
    return null;
  }

  return (
    <div
      className={cn(
        "bg-background sticky top-16 z-10 flex w-fit flex-col-reverse justify-end gap-2 lg:flex-row-reverse",
        !editor.isEditable && "hidden"
      )}
    >
      {editor.isEditable && (
        <Badge
          variant="outline"
          className={cn(
            "h-fit self-end text-xs lg:self-center",
            saved && "text-background bg-green-400"
          )}
        >
          {saved ? "Saved" : "Not Saved"}
        </Badge>
      )}
      {/* {showEditButton && ( */}
      {/*   <Button */}
      {/*     onClick={() => { */}
      {/*       setIsEditable(!isEditable); */}
      {/*       editor.setEditable(!editor.isEditable); */}
      {/*     }} */}
      {/*     className="h-auto" */}
      {/*     variant="outline" */}
      {/*   > */}
      {/*     <FilePenLine /> */}
      {/*   </Button> */}
      {/* )} */}
      {editor.isEditable && (
        <div>
          <div className="flex flex-wrap gap-2 rounded border p-2">
            <Button
              onClick={() => editor.chain().focus().toggleBold().run()}
              disabled={!editor.can().chain().focus().toggleBold().run()}
              className={cn(
                "h-min w-min !p-2",
                editor.isActive("bold") ? "bg-foreground text-background" : ""
              )}
              variant="outline"
            >
              <Bold />
            </Button>
            <Button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              disabled={!editor.can().chain().focus().toggleItalic().run()}
              className={cn(
                "h-min w-min !p-2",
                editor.isActive("italic") ? "bg-foreground text-background" : ""
              )}
              variant="outline"
            >
              <Italic />
            </Button>
            <Button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              disabled={!editor.can().chain().focus().toggleStrike().run()}
              className={cn(
                "h-min w-min !p-2",
                editor.isActive("strike") ? "bg-foreground text-background" : ""
              )}
              variant="outline"
            >
              <Strikethrough />
            </Button>
            {/* <Separator orientation="vertical" className="h-auto" /> */}
            {/* <Button onClick={() => editor.chain().focus().unsetAllMarks().run()}> */}
            {/*   Clear marks */}
            {/* </Button> */}
            {/* <Button onClick={() => editor.chain().focus().clearNodes().run()}> */}
            {/*   Clear nodes */}
            {/* </Button> */}
            <Separator orientation="vertical" className="h-auto" />
            <Button
              onClick={() => editor.chain().focus().setParagraph().run()}
              className={cn(
                "h-min w-min !p-2",
                editor.isActive("paragraph") && "bg-foreground text-background"
              )}
              variant="outline"
            >
              <Pilcrow />
            </Button>
            <Button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={cn(
                "h-min w-min !p-2",
                editor.isActive("heading", { level: 1 }) &&
                  "bg-foreground text-background"
              )}
              variant="outline"
            >
              <Heading1 />
            </Button>
            <Button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={cn(
                "h-min w-min !p-2",
                editor.isActive("heading", { level: 2 }) &&
                  "bg-foreground text-background"
              )}
              variant="outline"
            >
              <Heading2 />
            </Button>
            <Button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className={cn(
                "h-min w-min !p-2",
                editor.isActive("heading", { level: 3 }) &&
                  "bg-foreground text-background"
              )}
              variant="outline"
            >
              <Heading3 />
            </Button>
            <Button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 4 }).run()
              }
              className={cn(
                "h-min w-min !p-2",
                editor.isActive("heading", { level: 4 }) &&
                  "bg-foreground text-background"
              )}
              variant="outline"
            >
              <Heading4 />
            </Button>
            <Button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 5 }).run()
              }
              className={cn(
                "h-min w-min !p-2",
                editor.isActive("heading", { level: 5 }) &&
                  "bg-foreground text-background"
              )}
              variant="outline"
            >
              <Heading5 />
            </Button>
            <Button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 6 }).run()
              }
              className={cn(
                "h-min w-min !p-2",
                editor.isActive("heading", { level: 6 }) &&
                  "bg-foreground text-background"
              )}
              variant="outline"
            >
              <Heading6 />
            </Button>
            <Separator orientation="vertical" className="h-auto" />
            <Button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={cn(
                "h-min w-min !p-2",
                editor.isActive("bulletList")
                  ? "bg-foreground text-background"
                  : ""
              )}
              variant="outline"
            >
              <List />
            </Button>
            <Button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={cn(
                "h-min w-min !p-2",
                editor.isActive("orderedList")
                  ? "bg-foreground text-background"
                  : ""
              )}
              variant="outline"
            >
              <LayoutList />
            </Button>
            <Separator orientation="vertical" className="h-auto" />

            <Button
              onClick={() => editor.chain().focus().toggleCode().run()}
              disabled={!editor.can().chain().focus().toggleCode().run()}
              className={cn(
                "h-min w-min !p-2",
                editor.isActive("code") ? "bg-foreground text-background" : ""
              )}
              variant="outline"
            >
              <Code />
            </Button>
            <Button
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={cn(
                "h-min w-min !p-2",
                editor.isActive("codeBlock")
                  ? "bg-foreground text-background"
                  : ""
              )}
              variant="outline"
            >
              <SquareTerminal />
            </Button>
            <Button
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={cn(
                "h-min w-min !p-2",
                editor.isActive("blockquote")
                  ? "bg-foreground text-background"
                  : ""
              )}
              variant="outline"
            >
              <TextQuote />
            </Button>
            <Separator orientation="vertical" className="h-auto" />
            <Button
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              className="h-min w-min !p-2"
              variant="outline"
            >
              <SeparatorHorizontal />
            </Button>
            <Button
              onClick={() => editor.chain().focus().setHardBreak().run()}
              className="h-min w-min !p-2"
              variant="outline"
            >
              <CornerDownRight />
            </Button>
            <Separator orientation="vertical" className="h-auto" />
            <Button
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().chain().focus().undo().run()}
              className="h-min w-min !p-2"
              variant="outline"
            >
              <Undo />
            </Button>
            <Button
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().chain().focus().redo().run()}
              className="h-min w-min !p-2"
              variant="outline"
            >
              <Redo />
            </Button>
            {/* <Button */}
            {/*   onClick={() => editor.chain().focus().setColor("#958DF1").run()} */}
            {/*   className={ */}
            {/*     editor.isActive("textStyle", { color: "#958DF1" }) */}
            {/*       ? "is-active" */}
            {/*       : "" */}
            {/*   } */}
            {/* > */}
            {/*   Purple */}
            {/* </Button> */}
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
                  "focus-visible:bg-accent focus-visible:text-accent-foreground h-min w-min !p-2",
                  editor.isActive("bold") ? "bg-foreground text-background" : ""
                )}
                variant="outline"
              >
                <Bold />
              </Button>
              <Button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={cn(
                  "focus-visible:bg-accent focus-visible:text-accent-foreground h-min w-min !p-2",
                  editor.isActive("italic")
                    ? "bg-foreground text-background"
                    : ""
                )}
                variant="outline"
              >
                <Italic />
              </Button>
              <Button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                disabled={!editor.can().chain().focus().toggleStrike().run()}
                className={cn(
                  "focus-visible:bg-accent focus-visible:text-accent-foreground h-min w-min !p-2",
                  editor.isActive("strike")
                    ? "bg-foreground text-background"
                    : ""
                )}
                variant="outline"
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
                  "focus-visible:bg-accent focus-visible:text-accent-foreground h-min w-min !p-2",
                  editor.isActive("bold") ? "bg-foreground text-background" : ""
                )}
                variant="outline"
              >
                <Bold />
              </Button>
              <Button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={cn(
                  "focus-visible:bg-accent focus-visible:text-accent-foreground h-min w-min !p-2",
                  editor.isActive("italic")
                    ? "bg-foreground text-background"
                    : ""
                )}
                variant="outline"
              >
                <Italic />
              </Button>
              <Button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                disabled={!editor.can().chain().focus().toggleStrike().run()}
                className={cn(
                  "focus-visible:bg-accent focus-visible:text-accent-foreground h-min w-min !p-2",
                  editor.isActive("strike")
                    ? "bg-foreground text-background"
                    : ""
                )}
                variant="outline"
              >
                <Strikethrough />
              </Button>
            </div>
          </BubbleMenu>
        </div>
      )}
    </div>
  );
};

const extensions = [
  Highlight,
  Typography,
  // HorizontalRule,
  // BulletList,
  // OrderedList,
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  Mention.configure({
    HTMLAttributes: {
      class: "mention",
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    suggestion,
    deleteTriggerWithBackspace: true,
  }),
  Placeholder.configure({
    // Use a placeholder:
    placeholder: "Write something …",
    // Use different placeholders depending on the node type:
    // placeholder: ({ node }) => {
    //   if (node.type.name === "heading") {
    //     return "What’s the title?";
    //   }
    //
    //   return "Can you add some further context?";
    // },
  }),
  TextStyle,
  StarterKit,
];

export default function TiptapEditor({
  editable,
  onUpdate,
  content,
  saved = true,
}: {
  editable: boolean;
  onUpdate?: ({ editor }: { editor: Editor }) => void;
  content?: string;
  saved?: boolean;
}) {
  return (
    <div className="flex h-full w-full flex-col gap-10">
      {/* <article className="prose flex w-full min-w-full flex-col items-start justify-center gap-0 whitespace-pre-wrap text-foreground/90 dark:prose-invert lg:prose-xl prose-headings:text-foreground lg:px-24"> */}
      <EditorProvider
        editable={editable}
        slotBefore={<MenuBar showEditButton={!editable} saved={saved} />}
        extensions={extensions}
        content={content || ""}
        onUpdate={onUpdate}
        immediatelyRender={false}
      />
      {/* </article> */}
    </div>
  );
}
