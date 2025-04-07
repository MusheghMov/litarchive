import { Circle, Minus, Plus } from "lucide-react";
import { useTheme } from "next-themes";
import { useAtom } from "jotai";
import { Button } from "@/components/ui/button";
import { fontSize as storeFontSize } from "@/providers/JotaiProvider";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { Separator } from "../ui/separator";

export default function ModeToggle({
  expanded,
  setExpanded,
}: {
  expanded: boolean;
  setExpanded: Dispatch<SetStateAction<boolean>>;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const [fontSize, setFontSize] = useAtom(storeFontSize);
  const { bookId } = useParams<{ bookId: string }>();
  const { setTheme } = useTheme();

  useEffect(() => {
    if (!ref.current) return;
    if (!expanded) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (!ref.current) return;
      if (ref.current.contains(e.target as HTMLElement)) return;

      setExpanded(false);
    };
    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [expanded]);
  return (
    <div
      ref={ref}
      autoFocus
      className={cn(
        "mode-toggle grid grid-rows-[0fr] overflow-hidden transition-[grid-template-rows] duration-500",
        expanded && "grid-rows-[1fr]"
      )}
    >
      <div className="flex w-full items-center justify-end gap-2 overflow-hidden">
        {bookId && (
          <div className="contents">
            <div className="flex w-fit flex-col items-center justify-center gap-2 px-2 py-1">
              <div className="flex flex-row items-center gap-2">
                <Button
                  className="group border-foreground/40 hover:border-foreground/80 h-min w-min rounded-full border bg-transparent p-2 hover:bg-transparent"
                  onClick={() => {
                    setFontSize(fontSize - 1);
                  }}
                >
                  <Minus
                    size={12}
                    className="stroke-foreground/40 group-hover:stroke-foreground/80"
                  />
                </Button>
                <p className="w-[20px] text-center text-sm">{fontSize}</p>
                <Button
                  className="group border-foreground/40 hover:border-foreground/80 h-min w-min rounded-full border bg-transparent p-2 hover:bg-transparent"
                  onClick={() => {
                    setFontSize(fontSize + 1);
                  }}
                >
                  <Plus
                    size={12}
                    className="stroke-foreground/40 group-hover:stroke-foreground/80"
                  />
                </Button>
              </div>
            </div>
            <Separator orientation="vertical" className="h-[80%]" />
          </div>
        )}
        <div className="flex w-fit gap-1 px-2 py-1">
          <Button
            variant="outline"
            size="icon"
            className="border-border/65 cursor-pointer rounded-full bg-transparent"
            onClick={() => setTheme("light")}
          >
            <Circle className="fill-white stroke-gray-300" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="border-border/65 cursor-pointer rounded-full bg-transparent"
            onClick={() => setTheme("green")}
          >
            <Circle className="fill-green-500 stroke-green-500" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="border-border/65 cursor-pointer rounded-full bg-transparent"
            onClick={() => setTheme("pink")}
          >
            <Circle className="fill-pink-500 stroke-pink-500" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="border-border/65 cursor-pointer rounded-full bg-transparent"
            onClick={() => setTheme("dark")}
          >
            <Circle className="fill-zinc-500 stroke-zinc-500" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="border-border/65 cursor-pointer rounded-full bg-transparent"
            onClick={() => setTheme("violet")}
          >
            <Circle className="fill-violet-500 stroke-violet-500" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="border-border/65 cursor-pointer rounded-full bg-transparent"
            onClick={() => setTheme("blue")}
          >
            <Circle className="fill-blue-500 stroke-blue-500" />
          </Button>
        </div>
      </div>
    </div>
  );
}
