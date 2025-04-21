import { useState } from "react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Genre } from "@/types";
import { Badge } from "@/components/ui/badge";

export function GenrePicker({
  genres,
  onSelect,
}: {
  genres: Genre[];
  onSelect: (genre: Genre) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Badge variant="outline" className="cursor-pointer text-xs">
          + add genre
        </Badge>
      </PopoverTrigger>
      <PopoverContent className="max-h-[400px] w-[200px] overflow-scroll p-0">
        <Command className="overflow-scroll">
          <CommandInput
            className="sticky top-0"
            placeholder="Search author..."
          />
          <CommandEmpty>No genre found.</CommandEmpty>
          <CommandGroup>
            {genres.map((genre) => (
              <CommandItem
                key={genre.id}
                disabled={false}
                value={genre.name!}
                onSelect={(currentValue) => {
                  const currentGenre = genres.find(
                    (genre) =>
                      genre.name?.trim().toLowerCase() ===
                      currentValue.trim().toLowerCase()
                  );
                  onSelect(currentGenre! as Genre);
                  setOpen(false);
                }}
              >
                {genre.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
