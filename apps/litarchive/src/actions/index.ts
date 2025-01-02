// "use server";
//
// import db from "../../../../packages/db";
// import {
//   authors,
//   books,
// } from "../../../../packages/db/schema";
// import { createInsertSchema } from "drizzle-zod";
// import { z } from "zod";

// async function getNextBook(currentBookId: number) {
//   const nextBook = await db.query.books.findFirst({
//     where: (books, { gt }) => gt(books.id, currentBookId),
//   });
//
//   return nextBook || null;
// }
//
// async function getPreviousBook(currentBookId: number) {
//   const previousBook = await db.query.books.findFirst({
//     where: (books, { lt }) => lt(books.id, currentBookId),
//     orderBy: (books, { desc }) => desc(books.id),
//   });
//
//   return previousBook;
// }

// async function createBook(
//   data: z.infer<typeof schemaForCreateBook>,
//   authorId: number,
//   authorName: string,
//   bookImageUrl: string | undefined
// ) {
//   const res = await db.insert(books).values({
//     title: data.title,
//     titleTranslit: data.titleTranslit,
//     sourceUrl: data.sourceUrl,
//     imageUrl: bookImageUrl,
//     text: data.text,
//     year: data.year,
//     fileUrl: data.fileUrl,
//     authorId: authorId,
//     authorName: authorName,
//     description: data.description,
//   });
//
//   return res;
// }
//
// async function createAuthor(
//   data: z.infer<typeof schemaForCreateAuthor>,
//   imageUrl: string | undefined
// ) {
//   const res = await db.insert(authors).values({
//     name: data.name,
//     imageUrl: imageUrl,
//     bio: data.bio,
//     birthDate: data.birthDate,
//     deathDate: data.deathDate,
//   });
//
//   return res;
// }
