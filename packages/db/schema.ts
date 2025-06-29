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
      .references(() => user.id, { onDelete: "cascade" }),
    authorId: integer("author_id")
      .notNull()
      .references(() => authors.id, { onDelete: "cascade" }),
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
  imageStatus: text("image_status"), // "pending" | "generating" | "completed" | "failed"
  imageGeneratedAt: text("image_generated_at"),
  userId: integer("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  isPublic: integer("is_public", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const userBookCollaborators = sqliteTable(
  "userBookCollaborators",
  {
    id: integer("id").primaryKey(),
    userBookId: integer("user_book_id")
      .notNull()
      .references(() => userBooks.id, { onDelete: "cascade" }),
    userId: integer("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    role: text({ enum: ["editor", "viewer"] }).notNull(),
    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => ({
    // Create a unique index to prevent duplicate collaborations
    unq: uniqueIndex("user_book_collaborator_unique").on(
      t.userBookId,
      t.userId,
    ),
  }),
);

// UserBook chapters table
export const userBookChapters = sqliteTable("userBookChapters", {
  id: integer("id").primaryKey(),
  number: integer("number").notNull(), // Chapter number field
  title: text("title").notNull(),
  content: text("content").notNull(),
  userBookId: integer("user_book_id")
    .notNull()
    .references(() => userBooks.id, { onDelete: "cascade" }),
  audioUrl: text("audio_url"),
  audioGeneratedAt: text("audio_generated_at"),
  audioStatus: text("audio_status"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const chapterVersions = sqliteTable("chapterVersions", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  content: text("content").notNull(),
  versionNumber: integer("version_number").notNull(),
  isCurrentlyPublished: integer("is_currently_published", {
    mode: "boolean",
  }).default(false),
  userBookChapterId: integer("user_book_chapter_id")
    .notNull()
    .references(() => userBookChapters.id, { onDelete: "cascade" }),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  lastPublishedAt: text("last_published_at"),
});

// Book lists table
export const bookLists = sqliteTable("bookLists", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  userId: integer("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
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
      .references(() => books.id, { onDelete: "cascade" }),
    listId: integer("list_id")
      .notNull()
      .references(() => bookLists.id, { onDelete: "cascade" }),
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
      .references(() => user.id, { onDelete: "cascade" }),
    bookId: integer("book_id")
      .notNull()
      .references(() => books.id, { onDelete: "cascade" }),
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
      .references(() => books.id, { onDelete: "cascade" })
      .notNull(),
    genreId: integer("genre_id")
      .references(() => genre.id, { onDelete: "cascade" })
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

export const userBooksToGenre = sqliteTable(
  "userBooks_to_genre",
  {
    userBookId: integer("user_book_id")
      .references(() => userBooks.id, { onDelete: "cascade" })
      .notNull(),
    genreId: integer("genre_id")
      .references(() => genre.id, { onDelete: "cascade" })
      .notNull(),
  },
  (t) => {
    return {
      pk: primaryKey({
        name: "userBooks_to_genre_pkey",
        columns: [t.userBookId, t.genreId],
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
    .references(() => user.id, { onDelete: "cascade" }),
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
    .references(() => user.id, { onDelete: "cascade" }),
  articleId: integer("article_id")
    .notNull()
    .references(() => articles.id, { onDelete: "cascade" }),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const userLikedBooks = sqliteTable("userLikedBooks", {
  id: integer("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  bookId: integer("book_id")
    .notNull()
    .references(() => books.id, { onDelete: "cascade" }),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const userLikedAuthors = sqliteTable("userLikedAuthors", {
  id: integer("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  authorId: integer("author_id")
    .notNull()
    .references(() => authors.id, { onDelete: "cascade" }),
});

export const userReadingProgress = sqliteTable("userReadingProgress", {
  id: integer("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  bookId: integer("book_id")
    .notNull()
    .references(() => books.id, { onDelete: "cascade" }),
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
  bookCollaborations: many(userBookCollaborators),
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
  genres: many(userBooksToGenre),
  collaborators: many(userBookCollaborators),
}));

export const userBookCollaboratorsRelations = relations(
  userBookCollaborators,
  ({ one }) => ({
    userBook: one(userBooks, {
      fields: [userBookCollaborators.userBookId],
      references: [userBooks.id],
    }),
    user: one(user, {
      fields: [userBookCollaborators.userId],
      references: [user.id],
    }),
  }),
);

export const userBookChaptersRelations = relations(
  userBookChapters,
  ({ one, many }) => ({
    userBook: one(userBooks, {
      fields: [userBookChapters.userBookId],
      references: [userBooks.id],
    }),
    versions: many(chapterVersions),
  }),
);

export const chapterVersionsRelations = relations(
  chapterVersions,
  ({ one }) => ({
    chapter: one(userBookChapters, {
      fields: [chapterVersions.userBookChapterId],
      references: [userBookChapters.id],
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
  userBooksToGenre: many(userBooksToGenre),
}));

export const booksToGenreRelations = relations(booksToGenre, ({ one }) => ({
  book: one(books, {
    fields: [booksToGenre.bookId],
    references: [books.id],
  }),
  genre: one(genre, {
    fields: [booksToGenre.genreId],
    references: [genre.id],
  }),
}));

export const userBooksToGenreRelations = relations(
  userBooksToGenre,
  ({ one }) => ({
    userBook: one(userBooks, {
      fields: [userBooksToGenre.userBookId],
      references: [userBooks.id],
    }),
    genre: one(genre, {
      fields: [userBooksToGenre.genreId],
      references: [genre.id],
    }),
  }),
);

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
