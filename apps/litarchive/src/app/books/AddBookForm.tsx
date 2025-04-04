/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// import { createBook } from "@/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Combobox } from "@/components/Combobox";
import { Author } from "@/types";

const BookScheme = z.object({
  title: z.string(),
  titleTranslit: z.string().optional(),
  sourceUrl: z.string().optional(),
  imageUrl: z.string(),
  text: z.string(),
  year: z.coerce.number(),
  fileUrl: z.string(),
  authorId: z.number(),
  description: z.string().optional(),
});
export default function AddABookForm({
  authors,
  bookImageUrl,
}: {
  authors: Author[];
  bookImageUrl: string | undefined;
}) {
  const [selectedAuthor, setSelectedAuthor] = useState<Author>();
  const router = useRouter();
  const form = useForm<z.infer<typeof BookScheme>>({
    resolver: zodResolver(BookScheme),
    defaultValues: {
      title: "",
      titleTranslit: "",
      sourceUrl: "",
      description: "",
      imageUrl: "",
      text: "",
      year: 0,
      fileUrl: "",
      authorId: 0,
    },
  });
  function onSubmit(data: z.infer<typeof BookScheme>) {
    if (!selectedAuthor || !selectedAuthor.id || !selectedAuthor.name) {
      form.setError("authorId", { message: "Author is required" });
      return;
    }
    // createBook(data, selectedAuthor.id, selectedAuthor.name, bookImageUrl).then(
    //   () => {
    //     router.refresh();
    //     form.reset();
    //   }
    // );
  }
  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Book title</FormLabel>
              <FormControl>
                <Input placeholder="Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="titleTranslit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Book title translit</FormLabel>
              <FormControl>
                <Input placeholder="Title translit" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sourceUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Source link</FormLabel>
              <FormControl>
                <Input placeholder="Source link" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Year</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Book description" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Text</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="text" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex w-full flex-row justify-between">
          <Combobox
            authors={authors}
            selectedAuthor={selectedAuthor}
            setSelectedAuthor={setSelectedAuthor}
          />
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
}
