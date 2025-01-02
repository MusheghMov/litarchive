"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AddAuthorsForm from "./AddAuthorsForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CircleUser } from "lucide-react";
import { useRef, useState } from "react";
import type { PutBlobResult } from "@vercel/blob";

export const AddAuthorCard = () => {
  const authorImageRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  return (
    <Card className="sticky top-0 h-max w-[400px]">
      <CardHeader className="flex w-full flex-row justify-between">
        <div className="flex-1">
          <CardTitle>Add Author Here</CardTitle>
          <CardDescription>Add your favourite authors</CardDescription>
        </div>
        <div>
          <Avatar className="h-11 w-11">
            <AvatarImage className="object-cover" src={imageUrl || blob?.url} />
            <AvatarFallback>
              <Label htmlFor="avatar" className="h-full w-full cursor-pointer">
                <CircleUser className="h-full w-full" />
              </Label>
              <form
                id="author-image"
                onChange={async (event) => {
                  event.preventDefault();
                  if (!authorImageRef.current?.files) {
                    throw new Error("No file selected");
                  }
                  const file = authorImageRef.current.files[0];
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
                  ref={authorImageRef}
                />
              </form>
            </AvatarFallback>
          </Avatar>
        </div>
      </CardHeader>
      <CardContent>
        <AddAuthorsForm imageUrl={blob?.url} />
      </CardContent>
    </Card>
  );
};
