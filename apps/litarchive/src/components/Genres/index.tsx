"use client";

import { Badge } from "@/components/ui/badge";
import { GenrePicker } from "@/components/GenrePicker";
import honoClient from "@/app/honoRPCClient";
import { Genre } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { useAuth } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";

export default function Genres({
  genres,
  bookId,
  isUserEditor,
}: {
  genres: Genre[] | undefined;
  bookId: number;
  isUserEditor: boolean;
}) {
  const { userId } = useAuth();
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>(genres || []);

  const { data: allGenres } = useQuery({
    queryKey: ["genres"],
    queryFn: async () => {
      const genresJson = await honoClient.genres.$get();

      if (genresJson.ok) {
        return await genresJson.json();
      }
    },
  });

  const { mutate: addGenreToBook } = useMutation({
    mutationFn: async ({ genreId }: { genreId: number }) => {
      try {
        const genresJson = await honoClient.genres.community.books[
          ":bookId"
        ].$post(
          {
            query: { genreId: genreId?.toString() },
            param: { bookId: bookId?.toString() },
          },
          {
            headers: { Authorization: `${userId}` },
          }
        );

        if (genresJson.ok) {
          return await genresJson.json();
        }
      } catch (error) {
        console.error("Error adding genre to book:", error);
      }
    },
  });

  const ganresToSelect = useMemo(() => {
    if (!allGenres) {
      return [];
    }
    return allGenres.filter(
      (genre) => selectedGenres.findIndex((g) => g.id === genre.id) === -1
    );
  }, [genres, allGenres, selectedGenres]);

  return (
    <div className="flex w-full gap-1">
      {selectedGenres.map((genre) => (
        <Badge key={genre.id} variant="outline" className="text-xs">
          {genre.name}
        </Badge>
      ))}
      {isUserEditor && (
        <GenrePicker
          genres={ganresToSelect}
          onSelect={(genre) => {
            addGenreToBook({ genreId: genre.id });
            setSelectedGenres((prev) => [...prev, genre]);
          }}
        />
      )}
    </div>
  );
}
