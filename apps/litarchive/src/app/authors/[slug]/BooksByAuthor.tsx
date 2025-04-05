"use client";

import Fuse from "fuse.js";
import BookCard from "@/components/BookCard";
import { Input } from "@/components/ui/input";
import React, { useCallback, useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

enum SortOptions {
  yearASC = "yearASC",
  yearDESC = "yearDESC",
  nameASC = "nameASC",
  nameDESC = "nameDESC",
}
const getSortLabel = (option: SortOptions): string => {
  switch (option) {
    case SortOptions.yearASC:
      return "Year (Ascending)";
    case SortOptions.yearDESC:
      return "Year (Descending)";
    case SortOptions.nameASC:
      return "Name (A-Z)";
    case SortOptions.nameDESC:
      return "Name (Z-A)";
    default:
      return "Unknown";
  }
};
const fuseOptions = {
  // isCaseSensitive: false,
  // includeScore: false,
  // ignoreDiacritics: false,
  shouldSort: true,
  // includeMatches: false,
  // findAllMatches: false,
  // minMatchCharLength: 1,
  // location: 0,
  threshold: 0.3,
  // distance: 100,
  // useExtendedSearch: false,
  // ignoreLocation: false,
  // ignoreFieldNorm: false,
  // fieldNormWeight: 1,
  keys: ["title", "titleTranslit"],
};
export default function BooksByAuthor({
  booksByAuthor,
}: {
  booksByAuthor: {
    title: string | null;
    titleTranslit: string | null;
    year: number | null;
    id: number;
    authorId: number | null;
    author: {
      name: string | null;
      id: number;
    } | null;
    textLength: number;
    bookPagesCount: number;
  }[];
}) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOptions>(SortOptions.yearDESC);
  const fuse = new Fuse(booksByAuthor, fuseOptions);
  const filteredBooks = useMemo(() => {
    switch (sort) {
      case SortOptions.yearASC:
        return fuse
          .search(search || " ")
          .sort((a, b) => a.item.year! - b.item.year!)
          .map((a) => a.item);
      case SortOptions.yearDESC:
        return fuse
          .search(search || " ")
          .sort((a, b) => b.item.year! - a.item.year!)
          .map((a) => a.item);
      case SortOptions.nameDESC:
        return fuse
          .search(search || " ")
          .sort((a, b) => b.item.title!.localeCompare(a.item.title!))
          .map((a) => a.item);
      case SortOptions.nameASC:
        return fuse
          .search(search || " ")
          .sort((a, b) => a.item.title!.localeCompare(b.item.title!))
          .map((a) => a.item);
      default:
        return fuse.search(search).map((a) => a.item);
    }
  }, [search, sort]);

  const handleSortOptionChange = useCallback((newOption: string) => {
    setSort(newOption as SortOptions);
  }, []);

  return (
    <div className="grid w-full gap-4">
      <div className="sticky top-16 z-40 flex w-full items-center justify-between gap-2 md:top-20">
        <Input
          onChange={(e) => setSearch(e.target.value)}
          className="w-full shadow-md sm:w-[400px]"
          placeholder="Search for book by title or author name"
        />
        <Select value={sort} onValueChange={handleSortOptionChange}>
          <SelectTrigger className="bg-background h-10 w-48">
            <SelectValue placeholder="Select sorting option">
              {getSortLabel(sort)}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sort by</SelectLabel>
              {Object.values(SortOptions).map((option) => (
                <SelectItem key={option} value={option}>
                  {getSortLabel(option as SortOptions)}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="grid w-full grid-cols-2 gap-6 md:grid-cols-3">
        {filteredBooks?.map((book: any) => (
          <BookCard
            key={book.id}
            book={book}
            isLiked={book?.userLikedBooks?.length > 0}
          />
        ))}
      </div>
    </div>
  );
}
