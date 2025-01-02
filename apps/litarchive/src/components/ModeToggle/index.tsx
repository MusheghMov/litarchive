import { Circle, Minus, Plus } from "lucide-react";
import { useTheme } from "next-themes";
import { useAtom } from "jotai";
import { Button } from "@/components/ui/button";
import { fontSize as storeFontSize } from "@/providers/JotaiProvider";
import { useParams, useRouter } from "next/navigation";
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
  const [fontSize, setFontSize] = useAtom(storeFontSize);
  const { bookId } = useParams<{ bookId: string }>();
  // const router = useRouter();
  const { setTheme } = useTheme();

  // const { data: nextBook } = useQuery({
  //   queryKey: ["nextBook", bookId],
  //   queryFn: () => getNextBook(+bookId),
  //   enabled: !!bookId,
  // });
  //
  // const { data: prevBook } = useQuery({
  //   queryKey: ["prevBook", bookId],
  //   queryFn: () => getPreviousBook(+bookId),
  //   enabled: !!bookId,
  // });

  const ref = useRef<HTMLDivElement>(null);

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
              {/* <p className="flex-1 text-xs font-thin uppercase">Font Size:</p> */}
              <div className="flex flex-row items-center gap-2">
                <Button
                  className="group h-min w-min rounded-full border border-foreground/40 bg-transparent p-2 hover:border-foreground/80 hover:bg-transparent"
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
                  className="group h-min w-min rounded-full border border-foreground/40 bg-transparent p-2 hover:border-foreground/80 hover:bg-transparent"
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
            className="cursor-pointer rounded-full border-border/65 bg-transparent"
            onClick={() => setTheme("light")}
          >
            <Circle className="fill-white stroke-gray-300" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="cursor-pointer rounded-full border-border/65 bg-transparent"
            onClick={() => setTheme("slate")}
          >
            <Circle className="fill-slate-500 stroke-slate-500" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="cursor-pointer rounded-full border-border/65 bg-transparent"
            onClick={() => setTheme("green")}
          >
            <Circle className="fill-green-500 stroke-green-500" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="cursor-pointer rounded-full border-border/65 bg-transparent"
            onClick={() => setTheme("zink")}
          >
            <Circle className="fill-zinc-500 stroke-zinc-500" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="cursor-pointer rounded-full border-border/65 bg-transparent"
            onClick={() => setTheme("violet")}
          >
            <Circle className="fill-violet-500 stroke-violet-500" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="cursor-pointer rounded-full border-border/65 bg-transparent"
            onClick={() => setTheme("blue")}
          >
            <Circle className="fill-blue-500 stroke-blue-500" />
          </Button>
        </div>

        {/* <div className="flex w-full flex-row justify-between gap-2"> */}
        {/*   <Button */}
        {/*     className="w-full capitalize" */}
        {/*     onClick={() => { */}
        {/*       router.push(`/books/${prevBook?.id}?page=1`); */}
        {/*     }} */}
        {/*     disabled={!prevBook} */}
        {/*   > */}
        {/*     previous book */}
        {/*   </Button> */}
        {/*   <Button */}
        {/*     className="w-full capitalize" */}
        {/*     onClick={() => { */}
        {/*       router.push(`/books/${nextBook?.id}?page=1`); */}
        {/*     }} */}
        {/*     disabled={!nextBook} */}
        {/*   > */}
        {/*     next book */}
        {/*   </Button> */}
        {/* </div> */}
      </div>
    </div>
  );
}
