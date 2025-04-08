import { PopoverAnchor } from "@radix-ui/react-popover";
import { useEffect, useState } from "react";
import { Popover, PopoverContent } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";

export default function PopoverWrapper({
  props,
  open,
}: {
  props: any;
  open: boolean;
}) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(open);

  const selectItem = (index: number) => {
    const item = props.items[index];

    if (item) {
      props.command({ id: item });
    }
  };
  useEffect(() => {
    setIsPopoverOpen(open);
  }, [open]);

  return (
    <Popover open={isPopoverOpen}>
      <PopoverAnchor asChild>
        <div id="mention-anchor" />
      </PopoverAnchor>
      <PopoverContent
        className="p-0"
        side="bottom"
        align="start"
        sideOffset={30}
      >
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {props.items.map((item: string, index: number) => (
                <CommandItem
                  key={item}
                  value={item}
                  onSelect={(_currentValue) => {
                    selectItem(index);
                  }}
                >
                  {item}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
        {/* <MentionList {...props} /> */}
      </PopoverContent>
    </Popover>
  );
}
