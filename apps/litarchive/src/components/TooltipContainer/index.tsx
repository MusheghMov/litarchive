"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { TooltipPortal } from "@radix-ui/react-tooltip";

export default function TooltipContainer({
  children,
  tooltipContent,
  side = "top",
  classname = "",
  disableTooltip,
}: {
  children: React.ReactNode;
  classname?: string;
  side?: "top" | "bottom" | "left" | "right";
  tooltipContent?: React.ReactNode | string;
  disableTooltip?: boolean;
}) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300} defaultOpen={false}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        {!disableTooltip && (
          <TooltipPortal>
            {tooltipContent && (
              <TooltipContent
                side={side}
                className={cn("max-w-[600px]", classname)}
              >
                <div>{tooltipContent}</div>
              </TooltipContent>
            )}
          </TooltipPortal>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}
