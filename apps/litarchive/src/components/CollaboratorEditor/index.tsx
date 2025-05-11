"use client";

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
import { Badge } from "@/components/ui/badge";
import honoClient from "@/app/honoRPCClient";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import { Button } from "../ui/button";
import { Eye, Pencil, Trash } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function CollaboratorEditor({
  collaborators,
  bookId,
  isUserAuthor,
}: {
  collaborators: {
    id: number;
    user: {
      firstName: string | null;
      lastName: string | null;
      email: string | null;
      imageUrl: string | null;
    };
    role: string;
  }[];
  bookId: number;
  isUserAuthor: boolean;
}) {
  const { getToken } = useAuth();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");

  const { mutate: onCreateCollaborator } = useMutation({
    mutationFn: async ({ role }: { role: "viewer" | "editor" }) => {
      const token = await getToken();
      if (!token) {
        return;
      }

      return await honoClient.community.books.collaboration.create.$post(
        {
          query: {
            bookId: bookId.toString(),
            collaboratorEmail: email,
            role: role,
          },
        },
        {
          headers: { Authorization: token },
        }
      );
    },
    onError: () => {
      toast.error("Error adding collaborator");
    },
    onSuccess: async (res) => {
      if (res?.ok) {
        toast.success("Collborator added");
        router.refresh();
      }
    },
  });
  const { mutate: onUpdateCollaborator } = useMutation({
    mutationFn: async ({
      userBookCollaboratorsId,
      role,
    }: {
      userBookCollaboratorsId: string;
      role: "viewer" | "editor";
    }) => {
      const token = await getToken();
      if (!token) {
        return;
      }

      return await honoClient.community.books.collaboration.update.$post(
        {
          query: {
            bookId: bookId.toString(),
            userBookCollaboratorsId: userBookCollaboratorsId,
            role: role,
          },
        },
        {
          headers: { Authorization: token },
        }
      );
    },
    onError: () => {
      toast.error("Error updating collaborator");
    },
    onSuccess: async (res) => {
      if (res?.ok) {
        toast.success(`Updated collaborator`);
        router.refresh();
      }
    },
  });

  const { mutate: onDeleteCollaborator } = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      if (!token) {
        return;
      }
      return await honoClient.community.books.collaboration.delete.$delete(
        {
          query: {
            bookId: bookId.toString(),
            collaboratorEmail: "mushegh.movsisian@gmail.com",
          },
        },
        {
          headers: { Authorization: token },
        }
      );
    },
    onError: () => {
      toast.error("Error deleting collaborator");
    },
    onSuccess: async (res) => {
      if (res?.ok) {
        toast.success(`Deleted collaborator`);
        router.refresh();
      }
    },
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Badge variant="outline" className="cursor-pointer text-xs">
          + add collaborator
        </Badge>
      </PopoverTrigger>
      <PopoverContent className="max-h-[400px] w-fit min-w-[400px] overflow-scroll p-0">
        <Command className="overflow-scroll">
          <CommandInput
            className="sticky top-0"
            placeholder="Search collaborator..."
            value={email}
            onValueChange={(e) => {
              setEmail(e);
            }}
          />
          <CommandEmpty>
            <Button
              onClick={() => {
                onCreateCollaborator({ role: "viewer" });
              }}
            >
              Add collaborator
            </Button>
          </CommandEmpty>
          <CommandGroup>
            {collaborators.map((collaborator) => (
              <CommandItem
                className="line-clamp-1 flex w-full items-center justify-between gap-2"
                key={collaborator.user.email}
                disabled={false}
                value={collaborator.user.email!}
              >
                <div className="flex items-center gap-2">
                  <Avatar className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border">
                    <AvatarImage
                      src={collaborator.user.imageUrl || ""}
                      alt={collaborator.user.firstName || ""}
                    />
                    <AvatarFallback>
                      {`${collaborator?.user?.firstName?.charAt(0) || "U"}`}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-foreground text-sm">
                    {collaborator.user.firstName || "user"}{" "}
                    {collaborator.user.lastName || "user"}
                  </p>
                </div>
                {isUserAuthor ? (
                  <div>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteCollaborator();
                      }}
                    >
                      <Trash />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdateCollaborator({
                          userBookCollaboratorsId: collaborator.id.toString(),
                          role:
                            collaborator.role === "editor"
                              ? "viewer"
                              : "editor",
                        });
                      }}
                    >
                      {collaborator.role === "editor" ? <Pencil /> : <Eye />}
                    </Button>
                  </div>
                ) : (
                  <>{collaborator.role === "editor" ? <Pencil /> : <Eye />}</>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
