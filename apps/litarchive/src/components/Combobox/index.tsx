import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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

type AuthorType = {
  imageUrl: string | null;
  id: number;
  name: string | null;
  color: string | null;
  bio: string | null;
  birthDate: string | null;
  deathDate: string | null;
}[];
type SetSelectedAuthor = React.Dispatch<
  React.SetStateAction<{
    imageUrl: string | null;
    id: number;
    name: string | null;
    color: string | null;
    bio: string | null;
    birthDate: string | null;
    deathDate: string | null;
  } | null>
>;

export function Combobox({
  authors,
  setSelectedAuthor,
  selectedAuthor,
}: {
  authors: AuthorType;
  setSelectedAuthor: SetSelectedAuthor;
  selectedAuthor: AuthorType[0] | null;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedAuthor
            ? authors.find((author) => author.id === selectedAuthor.id)?.name
            : "Select author..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-h-[400px] w-[200px] overflow-scroll p-0">
        <Command className="overflow-scroll">
          <CommandInput
            className="sticky top-0"
            placeholder="Search author..."
          />
          <CommandEmpty>No author found.</CommandEmpty>
          <CommandGroup>
            {authors.map((author) => (
              <CommandItem
                key={author.id}
                value={author.name!}
                onSelect={(currentValue) => {
                  const currentAuthor = authors.find(
                    (author) =>
                      author.name?.trim().toLowerCase() ===
                      currentValue.trim().toLowerCase()
                  );
                  setSelectedAuthor(
                    currentAuthor! as AuthorType[0] | null as any
                  );
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedAuthor?.id === author.id
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                {author.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
