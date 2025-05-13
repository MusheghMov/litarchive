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
import honoClient from "@/app/honoRPCClient";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import { Button } from "../ui/button";
import { Eye, LoaderCircle, Pencil, Plus, Share2, Trash } from "lucide-react";
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

  const { mutate: onCreateCollaborator, isPending: isCreating } = useMutation({
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
        setEmail("");
        router.refresh();
      }
    },
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="secondary" className="w-fit">
          Share Setting <Share2 />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-h-[400px] w-fit min-w-[400px] overflow-scroll p-0">
        <Command className="overflow-scroll">
          <div className="relative flex w-full items-center justify-between gap-2">
            <CommandInput
              placeholder="Search collaborator..."
              value={email}
              onValueChange={(e) => {
                setEmail(e);
              }}
            />
            <Button
              variant="outline"
              disabled={isCreating}
              className="absolute top-0 right-2 bottom-0 m-auto w-fit cursor-pointer"
              onClick={() => {
                onCreateCollaborator({ role: "viewer" });
              }}
            >
              {isCreating ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <Plus />
              )}
            </Button>
          </div>
          <CommandEmpty>No collaborators found</CommandEmpty>
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
                  <div className="flex gap-2">
                    <DeleteCollaborator
                      userBookCollaboratorsId={collaborator.id}
                      bookId={bookId}
                    />
                    <UpdateCollaboratorRole
                      userBookCollaboratorsId={collaborator.id}
                      bookId={bookId}
                      role={collaborator.role as "viewer" | "editor"}
                    />
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

function UpdateCollaboratorRole({
  userBookCollaboratorsId,
  bookId,
  role,
}: {
  userBookCollaboratorsId: number;
  bookId: number;
  role: "viewer" | "editor";
}) {
  const { getToken } = useAuth();
  const router = useRouter();

  const { mutate: onUpdateCollaborator, isPending: isUpdating } = useMutation({
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
  return (
    <Button
      size="icon"
      variant="outline"
      disabled={isUpdating}
      onClick={() => {
        onUpdateCollaborator({
          userBookCollaboratorsId: userBookCollaboratorsId.toString(),
          role: role === "editor" ? "viewer" : "editor",
        });
      }}
    >
      {isUpdating ? (
        <LoaderCircle className="animate-spin" />
      ) : role === "editor" ? (
        <Pencil />
      ) : (
        <Eye />
      )}
    </Button>
  );
}

function DeleteCollaborator({
  userBookCollaboratorsId,
  bookId,
}: {
  userBookCollaboratorsId: number;
  bookId: number;
}) {
  const { getToken } = useAuth();
  const router = useRouter();

  const { mutate: onDeleteCollaborator, isPending: isDeleting } = useMutation({
    mutationFn: async (userBookCollaboratorsId: number) => {
      const token = await getToken();
      if (!token) {
        return;
      }
      return await honoClient.community.books.collaboration.delete.$delete(
        {
          query: {
            bookId: bookId.toString(),
            userBookCollaboratorsId: userBookCollaboratorsId.toString(),
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
    <Button
      size="icon"
      variant="outline"
      onClick={(e) => {
        e.stopPropagation();
        onDeleteCollaborator(userBookCollaboratorsId);
      }}
    >
      {isDeleting ? <LoaderCircle className="animate-spin" /> : <Trash />}
    </Button>
  );
}
