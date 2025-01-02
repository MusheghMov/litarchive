/* eslint-disable react/no-unescaped-entities */
"use client";
import React from "react";
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
// import { createAuthor } from "@/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";

const AuthorScheme = z.object({
  name: z.string().min(1, {
    message: "Author name is required",
  }),
  bio: z.string().optional(),
  birthDate: z.string().min(1, {
    message: "Birth date is required",
  }),
  deathDate: z.string().optional(),
});

export default function AddAuthorsForm({
  imageUrl,
}: {
  imageUrl: string | undefined;
}) {
  const router = useRouter();
  const form = useForm<z.infer<typeof AuthorScheme>>({
    resolver: zodResolver(AuthorScheme),
    defaultValues: {
      name: "",
      bio: "",
      birthDate: "",
      deathDate: "",
    },
  });
  function onSubmit(data: z.infer<typeof AuthorScheme>) {
    // createAuthor(data, imageUrl).then(() => {
    //   router.refresh();
    //   form.reset();
    // });
  }

  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Author's name</FormLabel>
              <FormControl>
                <Input placeholder="name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex w-full flex-row space-x-4">
          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Birth date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} max="2024-01-01" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="deathDate"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Death date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} max="2050-01-01" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Biography</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Author's biography" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
