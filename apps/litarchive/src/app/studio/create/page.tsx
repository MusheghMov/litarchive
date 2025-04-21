"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import honoClient from "@/app/honoRPCClient";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Asterisk, ImageIcon, WandSparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
  description: z.string().optional(),
  isPublic: z.boolean().optional(),
  coverImage: z.any().optional(),
});

export default function CommunityBooksCreatePage() {
  const { userId } = useAuth();
  const [previewImage, setPreviewImage] = useState<string | undefined>(
    undefined
  );
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      isPublic: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const resJson = await honoClient.community.books.$post(
        {
          form: {
            title: values.title,
            description: values.description,
            coverImage: values.coverImage,
            isPublic: (values.isPublic || false).toString(),
          },
        },
        { headers: { Authorization: `${userId}` } }
      );

      if (resJson.ok) {
        const res = await resJson.json();
        router.push("/community/" + res[0]?.slug);
      }
    } catch (error) {
      console.error("Error creating book:", error);
    }
  }

  return (
    <div className="flex w-full flex-col gap-8 lg:flex-row">
      <Card className="flex max-w-[300px] min-w-[300px] flex-col justify-between gap-2 p-2">
        <div className="flex flex-col gap-2">
          <CardContent className="overflow-hidden rounded p-0">
            {previewImage ? (
              <img
                src={previewImage}
                alt="Preview Image"
                className="h-full w-full object-cover"
              />
            ) : (
              <ImageIcon
                className="h-full w-full object-cover"
                strokeWidth={1}
              />
            )}
          </CardContent>
          <CardHeader className="px-3 py-0">
            <CardTitle className="line-clamp-2 text-base">
              {form.watch("title") || "Placeholder Title"}
            </CardTitle>
            <CardDescription className="line-clamp-2">
              {form.watch("description") || "Placeholder Description"}
            </CardDescription>
          </CardHeader>
        </div>
        <CardFooter className="flex items-center gap-4 px-3 py-0">
          <Badge variant="outline" className="text-xs">
            {form.watch("isPublic") ? "Public" : "Private"}
          </Badge>
        </CardFooter>
      </Card>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-end">
                  Title <Asterisk className="text-red-400" size={16} />
                </FormLabel>
                <FormControl>
                  <Input placeholder="Title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="Description" {...field} />
                </FormControl>
                <FormDescription>
                  A short description of the book. This will also help the AI
                  generate a cover image
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isPublic"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-4">
                  <FormLabel>Is Public</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <FormField
              control={form.control}
              name="coverImage"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Cover Image</FormLabel>
                  <FormControl>
                    <Input
                      {...fieldProps}
                      type="file"
                      accept="image/*"
                      size={3 * 1000 * 1000}
                      onChange={(event) => {
                        if (event.target.files && event.target.files[0]) {
                          setPreviewImage(
                            URL.createObjectURL(event.target.files[0])
                          );
                        }
                        return onChange(
                          event.target.files && event.target.files[0]
                        );
                      }}
                    />
                  </FormControl>
                  <FormDescription className="flex items-center gap-2">
                    Upload your cover image or leave it blank to let the AI
                    <WandSparkles className="text-primary" /> generate one for
                    you
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            type="submit"
            className="text-background cursor-pointer self-end"
            disabled={form.formState.isSubmitting}
          >
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
