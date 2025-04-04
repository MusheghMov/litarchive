"use client";

import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useAuth, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "@tanstack/react-query";
import honoClient from "@/app/honoRPCClient";
import { useModal } from "@/providers/ModalProvider";
import { ListPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { useState } from "react";

export default function AddToListButton({ bookId }: { bookId: number }) {
  const { isSignedIn } = useUser();
  const { userId } = useAuth();
  const { openModal } = useModal();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { data: lists, refetch: refetchLists } = useQuery({
    queryKey: ["lists"],
    queryFn: async () => {
      const res = await honoClient.lists.$get(
        {
          query: {},
        },
        {
          headers: { Authorization: userId || "" },
        }
      );
      if (res.ok) {
        return res.json();
      }
    },
    enabled: isSignedIn,
  });

  const { mutate: addToList } = useMutation({
    mutationFn: async ({
      listId,
      notes,
    }: {
      listId: number;
      notes?: string;
    }) => {
      const res = await honoClient.lists[":listId"]["books"][":bookId"].$post(
        {
          param: { listId: listId.toString(), bookId: bookId.toString() },
          json: { notes: notes || "" },
        },
        { headers: { Authorization: userId || "" } }
      );
      return res.json();
    },
    onSuccess: () => {
      router.refresh();
      refetchLists();
    },
  });

  const { mutate: createList } = useMutation({
    mutationFn: async ({ name }: { name: string }) => {
      const res = await honoClient.lists.$post(
        {
          json: {
            name: name,
          },
        },
        {
          headers: { Authorization: `${userId}` },
        }
      );
      if (res.ok) {
        return res.json();
      }
    },
    onSuccess: (res: any) => {
      addToList({ listId: res.id });
      router.refresh();
      refetchLists();
    },
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          className="group h-fit w-fit rounded-full border-primary/40 bg-background !p-2 active:scale-125 active:border-primary"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          onClick={(e) => {
            e.stopPropagation();
            if (!isSignedIn) {
              openModal({
                modalName: "SignUpSuggestionModal",
              });
              e.preventDefault();
              return;
            }
          }}
        >
          <ListPlus
            size={16}
            className={cn("stroke-primary/70 group-active:stroke-primary")}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="flex flex-col gap-2 pb-2"
        >
          <CommandInput
            placeholder="Search for a list"
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty className="flex items-center justify-center py-2">
              <p className="text-sm">No lists found</p>
            </CommandEmpty>
            <CommandGroup>
              {lists
                ?.filter(
                  (list) =>
                    list.booksToLists.findIndex(
                      (booksTolist) => booksTolist.book.id === bookId
                    ) === -1
                )
                .map((list) => (
                  <CommandItem
                    key={list.id}
                    value={list.id.toString()}
                    onSelect={(_currentValue) => {
                      addToList({ listId: list.id });
                      setOpen(false);
                    }}
                    className="data-[disabled]:pointer-events-auto data-[disabled]:opacity-100"
                  >
                    {list.name}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
          {lists?.findIndex((list) => list.name.trim() === search.trim()) ===
            -1 && (
            <Button
              disabled={!search}
              onClick={() => {
                createList({ name: search });
                setOpen(false);
              }}
              className="self-center text-background"
            >
              Create a new list
            </Button>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
