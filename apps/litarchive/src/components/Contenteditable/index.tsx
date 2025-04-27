"use client";

import { FocusEvent, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export default function Contenteditable({
  onBlur,
  text,
  className,
  contenteditable = false,
  placeholder = "write something...",
  ...props
}: {
  onBlur?: (e: FocusEvent<HTMLDivElement, Element>) => void;
  text?: string;
  className?: string;
  contenteditable?: boolean;
  placeholder?: string;
  props?: any;
}) {
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (titleRef.current) {
      if (text) {
        titleRef.current.innerText = text;
      }
    }
  }, [text]);

  return (
    <div
      {...props}
      ref={titleRef}
      onBlur={onBlur}
      contentEditable={contenteditable}
      aria-placeholder={placeholder}
      className={cn(
        `before:text-foreground/50 h-min min-h-0 w-full before:pointer-events-none empty:before:content-[attr(aria-placeholder)] focus-visible:outline-none`,
        className
      )}
      style={{
        content: "asdfasdfasdf",
      }}
    />
  );
}
