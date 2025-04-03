"use client";

import AuthorCard from "@/components/AuthorCard";
import { Input } from "@/components/ui/input";
import Fuse from "fuse.js";
import { useMemo, useState } from "react";
import { AuthorType } from "@/app/authors/page";

const fuseOptions = {
  shouldSort: true,
  threshold: 0.3,
  keys: ["name"],
};

export default function Authors({ authors }: { authors: AuthorType[] }) {
  const [search, setSearch] = useState("");
  const fuse = new Fuse(authors, fuseOptions);

  const filteredAuthors = useMemo(() => {
    return search ? fuse.search(search).map((a) => a.item) : authors;
  }, [search]);

  return (
    <div className="grid w-full gap-4">
      <Input
        onChange={(e) => setSearch(e.target.value)}
        className="w-full sm:w-[400px]"
        placeholder="Search for book by title or author name"
      />
      <div className="grid w-full grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {filteredAuthors?.map((author) => (
          <AuthorCard
            key={author.id}
            author={author}
            averageRating={author.averageRating || 0}
          />
        ))}
      </div>
    </div>
  );
}
