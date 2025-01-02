"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AddBookForm from "./AddBookForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CircleUser, PlusCircle } from "lucide-react";
import { useRef, useState } from "react";
import type { PutBlobResult } from "@vercel/blob";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@uidotdev/usehooks";

type AuthorType = {
  imageUrl: string | null;
  id: number;
  name: string | null;
  color: string | null;
  bio: string | null;
  birthDate: string | null;
  deathDate: string | null;
}[];

export const AddBookCard = ({ authors }: { authors: AuthorType }) => {
  const bookImageRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  if (isDesktop) {
    return (
      <Card className="sticky top-0 h-max w-[400px]">
        <CardHeader className="flex w-full flex-row justify-between">
          <div className="flex-1">
            <CardTitle>Add book here</CardTitle>
            <CardDescription>add your favourite books</CardDescription>
          </div>
          <div>
            <Avatar className="h-11 w-11">
              <AvatarImage
                className="object-cover"
                src={imageUrl || blob?.url}
              />
              <AvatarFallback>
                <Label
                  htmlFor="avatar"
                  className="h-full w-full cursor-pointer"
                >
                  <CircleUser className="h-full w-full" />
                </Label>
                <form
                  id="book-image"
                  onChange={async (event) => {
                    event.preventDefault();
                    if (!bookImageRef.current?.files) {
                      throw new Error("No file selected");
                    }
                    const file = bookImageRef.current.files[0];
                    setImageUrl(URL.createObjectURL(file));
                    const response = await fetch(
                      `/api/images?filename=${file.name}`,
                      {
                        method: "POST",
                        body: file,
                      }
                    );
                    const newBlob = (await response.json()) as PutBlobResult;
                    setBlob(newBlob);
                  }}
                >
                  <Input
                    type="file"
                    accept="image/png, image/gif, image/jpeg"
                    id="avatar"
                    className="hidden"
                    ref={bookImageRef}
                  />
                </form>

                <Input type="file" id="avatar" className="hidden" />
              </AvatarFallback>
            </Avatar>
          </div>
        </CardHeader>
        <CardContent>
          <AddBookForm authors={authors} bookImageUrl={blob?.url} />
        </CardContent>
      </Card>
    );
  } else {
    return (
      <Drawer>
        <DrawerTrigger className="sticky top-8 rounded-md border p-2">
          <PlusCircle />
        </DrawerTrigger>
        <DrawerContent className="h-max w-full p-4">
          <div className="flex w-full flex-row justify-between">
            <DrawerHeader className="flex flex-col items-start">
              <DrawerTitle>Add book here</DrawerTitle>
              <DrawerDescription>add your favourite books</DrawerDescription>
            </DrawerHeader>
            <Avatar className="h-11 w-11">
              <AvatarImage
                className="object-cover"
                src={imageUrl || blob?.url}
              />
              <AvatarFallback>
                <Label
                  htmlFor="avatar"
                  className="h-full w-full cursor-pointer"
                >
                  <CircleUser className="h-full w-full" />
                </Label>
                <form
                  id="book-image"
                  onChange={async (event) => {
                    event.preventDefault();
                    if (!bookImageRef.current?.files) {
                      throw new Error("No file selected");
                    }
                    const file = bookImageRef.current.files[0];
                    setImageUrl(URL.createObjectURL(file));
                    const response = await fetch(
                      `/api/images?filename=${file.name}`,
                      {
                        method: "POST",
                        body: file,
                      }
                    );
                    const newBlob = (await response.json()) as PutBlobResult;
                    setBlob(newBlob);
                  }}
                >
                  <Input
                    type="file"
                    accept="image/png, image/gif, image/jpeg"
                    id="avatar"
                    className="hidden"
                    ref={bookImageRef}
                  />
                </form>

                <Input type="file" id="avatar" className="hidden" />
              </AvatarFallback>
            </Avatar>
          </div>
          <div>
            <AddBookForm authors={authors} bookImageUrl={blob?.url} />
            {/* <DrawerClose> */}
            {/*   <Button variant="outline">Cancel</Button> */}
            {/* </DrawerClose> */}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }
};
