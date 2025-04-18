import {
  integer,
  primaryKey,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";

export const user = sqliteTable("user", {
  id: integer("id").primaryKey(),
  sub: text("sub").unique(),
  firstName: text("firstName"),
  lastName: text("lastName"),
  email: text("email"),
  imageUrl: text("imageUrl"),
});

export const authors = sqliteTable("author", {
  id: integer("id").primaryKey(),
  slug: text("slug").unique(),
  name: text("name"),
  name_original: text("name_original"),
  imageUrl: text("imageUrl"),
  color: text("color"),
  bio: text("bio"),
  birthDate: text("birthDate"),
  deathDate: text("deathDate"),
});

export const authorRatings = sqliteTable(
  "authorRatings",
  {
    id: integer("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => user.id),
    authorId: integer("author_id")
      .notNull()
      .references(() => authors.id),
    rating: integer("rating").notNull(), // e.g., 1-5 stars
    review: text("review"), // Optional text review
    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => {
    return {
      unq: uniqueIndex("user_author_rating_unique").on(t.userId, t.authorId),
    };
  },
);

export const books = sqliteTable("books", {
  id: integer("id").primaryKey(),
  title: text("title"),
  titleTranslit: text("titleTranslit"),
  imageUrl: text("imageUrl"),
  description: text("description"),
  text: text("text"),
  year: integer("year"),
  sourceUrl: text("sourceUrl"),
  fileUrl: text("fileUrl"),
  authorName: text("author_name"),
  authorId: integer("author_id").references(() => authors.id),
});

// Updated UserBooks table with slug field
export const userBooks = sqliteTable("userBooks", {
  id: integer("id").primaryKey(),
  slug: text("slug").unique(), // Added slug field with unique constraint
  title: text("title").notNull(),
  description: text("description"),
  coverImageUrl: text("cover_image_url"),
  userId: integer("user_id")
    .notNull()
    .references(() => user.id),
  isPublic: integer("is_public", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// UserBook chapters table
export const userBookChapters = sqliteTable("userBookChapters", {
  id: integer("id").primaryKey(),
  number: integer("number").notNull(), // Chapter number field
  title: text("title").notNull(),
  content: text("content").notNull(),
  userBookId: integer("user_book_id")
    .notNull()
    .references(() => userBooks.id),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Book lists table
export const bookLists = sqliteTable("bookLists", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  userId: integer("user_id")
    .notNull()
    .references(() => user.id),
  isPublic: integer("is_public", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Books to lists junction table
export const booksToLists = sqliteTable(
  "books_to_lists",
  {
    bookId: integer("book_id")
      .notNull()
      .references(() => books.id),
    listId: integer("list_id")
      .notNull()
      .references(() => bookLists.id),
    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
    notes: text("notes"),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.bookId, t.listId] }),
  }),
);

export const bookRatings = sqliteTable(
  "bookRatings",
  {
    id: integer("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => user.id),
    bookId: integer("book_id")
      .notNull()
      .references(() => books.id),
    rating: integer("rating").notNull(), // e.g., 1-5 stars
    review: text("review"), // Optional text review
    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => {
    return {
      unq: uniqueIndex("user_book_rating_unique").on(t.userId, t.bookId),
    };
  },
);

export const genre = sqliteTable("genre", {
  id: integer("id").primaryKey(),
  name: text("name"),
  description: text("description"),
});

export const booksToGenre = sqliteTable(
  "books_to_genre",
  {
    bookId: integer("book_id")
      .references(() => books.id)
      .notNull(),
    genreId: integer("genre_id")
      .references(() => genre.id)
      .notNull(),
  },
  (t) => {
    return {
      pk: primaryKey({
        name: "books_to_genre_pkey",
        columns: [t.genreId, t.genreId],
      }),
    };
  },
);

export const articles = sqliteTable("articles", {
  id: integer("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  description: text("description"),
  imageUrl: text("imageUrl"),
  userId: integer("user_id")
    .notNull()
    .references(() => user.id),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
  status: text("status").default("draft"),
  slug: text("slug").unique(),
  tags: text("tags"),
});

export const userLikedArticles = sqliteTable("userLikedArticles", {
  id: integer("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => user.id),
  articleId: integer("article_id")
    .notNull()
    .references(() => articles.id),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const userLikedBooks = sqliteTable("userLikedBooks", {
  id: integer("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => user.id),
  bookId: integer("book_id")
    .notNull()
    .references(() => books.id),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const userLikedAuthors = sqliteTable("userLikedAuthors", {
  id: integer("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => user.id),
  authorId: integer("author_id")
    .notNull()
    .references(() => authors.id),
});

export const userReadingProgress = sqliteTable("userReadingProgress", {
  id: integer("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => user.id),
  bookId: integer("book_id")
    .notNull()
    .references(() => books.id),
  lastCharacterIndex: integer("last_character_index").notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const userRelations = relations(user, ({ many }) => ({
  userLikedBooks: many(userLikedBooks),
  userLikedAuthors: many(userLikedAuthors),
  userReadingProgress: many(userReadingProgress),
  userLikedArticles: many(userLikedArticles),
  articles: many(articles),
  bookRatings: many(bookRatings),
  bookLists: many(bookLists),
  authorRatings: many(authorRatings),
  userBooks: many(userBooks),
}));

export const articlesRelations = relations(articles, ({ one, many }) => ({
  author: one(user, {
    fields: [articles.userId],
    references: [user.id],
  }),
  likes: many(userLikedArticles),
}));

export const userLikedArticlesRelations = relations(
  userLikedArticles,
  ({ one }) => ({
    user: one(user, {
      fields: [userLikedArticles.userId],
      references: [user.id],
    }),
    article: one(articles, {
      fields: [userLikedArticles.articleId],
      references: [articles.id],
    }),
  }),
);

export const authorRelations = relations(authors, ({ many }) => ({
  books: many(books),
  userLikedAuthors: many(userLikedAuthors),
  ratings: many(authorRatings),
}));

export const authorRatingsRelations = relations(authorRatings, ({ one }) => ({
  user: one(user, {
    fields: [authorRatings.userId],
    references: [user.id],
  }),
  author: one(authors, {
    fields: [authorRatings.authorId],
    references: [authors.id],
  }),
}));

export const booksRelations = relations(books, ({ one, many }) => ({
  author: one(authors, {
    fields: [books.authorId],
    references: [authors.id],
  }),
  booksToGenre: many(booksToGenre),
  userLikedBooks: many(userLikedBooks),
  userReadingProgress: many(userReadingProgress),
  ratings: many(bookRatings),
}));

export const userBooksRelations = relations(userBooks, ({ one, many }) => ({
  user: one(user, {
    fields: [userBooks.userId],
    references: [user.id],
  }),
  chapters: many(userBookChapters),
}));

export const userBookChaptersRelations = relations(
  userBookChapters,
  ({ one }) => ({
    userBook: one(userBooks, {
      fields: [userBookChapters.userBookId],
      references: [userBooks.id],
    }),
  }),
);

export const bookListsRelations = relations(bookLists, ({ one, many }) => ({
  user: one(user, {
    fields: [bookLists.userId],
    references: [user.id],
  }),
  booksToLists: many(booksToLists),
}));

export const booksToListsRelations = relations(booksToLists, ({ one }) => ({
  book: one(books, {
    fields: [booksToLists.bookId],
    references: [books.id],
  }),
  list: one(bookLists, {
    fields: [booksToLists.listId],
    references: [bookLists.id],
  }),
}));

export const bookRatingsRelations = relations(bookRatings, ({ one }) => ({
  user: one(user, {
    fields: [bookRatings.userId],
    references: [user.id],
  }),
  book: one(books, {
    fields: [bookRatings.bookId],
    references: [books.id],
  }),
}));

export const genreRelations = relations(genre, ({ many }) => ({
  booksToGenre: many(booksToGenre),
}));

export const boolsToGenreRelations = relations(booksToGenre, ({ one }) => ({
  book: one(books, {
    fields: [booksToGenre.bookId],
    references: [books.id],
  }),
  genre: one(genre, {
    fields: [booksToGenre.genreId],
    references: [genre.id],
  }),
}));

export const userLikedBooksRelations = relations(userLikedBooks, ({ one }) => ({
  user: one(user, {
    fields: [userLikedBooks.userId],
    references: [user.id],
  }),
  book: one(books, {
    fields: [userLikedBooks.bookId],
    references: [books.id],
  }),
}));

export const userReadingProgressRelations = relations(
  userReadingProgress,
  ({ one }) => ({
    user: one(user, {
      fields: [userReadingProgress.userId],
      references: [user.id],
    }),
    book: one(books, {
      fields: [userReadingProgress.bookId],
      references: [books.id],
    }),
  }),
);
