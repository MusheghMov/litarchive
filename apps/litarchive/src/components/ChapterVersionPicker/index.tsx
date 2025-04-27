import { ChevronsUpDown } from "lucide-react";
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
import { ChapterVersion } from "@/types";
import { Badge } from "../ui/badge";

export function ChapterVersionPicker({
  draftName,
  chapterVersions,
  selectedChapterVersion,
  setSelectedChapterVersion,
}: {
  draftName: string;
  chapterVersions: ChapterVersion[];
  selectedChapterVersion?: ChapterVersion | null;
  setSelectedChapterVersion: any;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Badge
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-fit cursor-pointer justify-between"
        >
          {selectedChapterVersion
            ? "Version " +
              chapterVersions.find(
                (chapterVersion) =>
                  chapterVersion.id === selectedChapterVersion.id
              )?.versionNumber
            : "Draft"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Badge>
      </PopoverTrigger>
      <PopoverContent className="max-h-[400px] w-[200px] overflow-scroll p-0">
        <Command className="overflow-scroll">
          <CommandInput
            className="sticky top-0"
            placeholder="Search version..."
          />
          <CommandEmpty>No version found.</CommandEmpty>
          <CommandGroup>
            <CommandItem
              value="draft"
              onSelect={() => {
                setSelectedChapterVersion(null);
                setOpen(false);
              }}
            >
              <span className="flex flex-col gap-1">
                <span>Draft</span>
                <span className="text-foreground/50 line-clamp-1 text-xs">
                  {draftName}
                </span>
              </span>
            </CommandItem>
            {chapterVersions.map((chapterVersion) => (
              <CommandItem
                key={chapterVersion.id}
                value={chapterVersion.versionNumber.toString()!}
                onSelect={(currentValue) => {
                  const currentChapterVersion = chapterVersions.find(
                    (chapterVersion) =>
                      chapterVersion.versionNumber
                        .toString()
                        ?.trim()
                        .toLowerCase() === currentValue.trim().toLowerCase()
                  );
                  setSelectedChapterVersion(
                    currentChapterVersion! as ChapterVersion
                  );
                  setOpen(false);
                }}
                className="flex flex-col items-start gap-1"
              >
                <span> Version {chapterVersion.versionNumber}</span>
                <span className="text-foreground/50 line-clamp-1 text-xs">
                  {chapterVersion.name}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
