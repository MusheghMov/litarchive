PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_articles` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`description` text,
	`imageUrl` text,
	`user_id` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`status` text DEFAULT 'draft',
	`slug` text,
	`tags` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_articles`("id", "title", "content", "description", "imageUrl", "user_id", "created_at", "updated_at", "status", "slug", "tags") SELECT "id", "title", "content", "description", "imageUrl", "user_id", "created_at", "updated_at", "status", "slug", "tags" FROM `articles`;--> statement-breakpoint
DROP TABLE `articles`;--> statement-breakpoint
ALTER TABLE `__new_articles` RENAME TO `articles`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `articles_slug_unique` ON `articles` (`slug`);--> statement-breakpoint
CREATE TABLE `__new_authorRatings` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`author_id` integer NOT NULL,
	`rating` integer NOT NULL,
	`review` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`author_id`) REFERENCES `author`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_authorRatings`("id", "user_id", "author_id", "rating", "review", "created_at", "updated_at") SELECT "id", "user_id", "author_id", "rating", "review", "created_at", "updated_at" FROM `authorRatings`;--> statement-breakpoint
DROP TABLE `authorRatings`;--> statement-breakpoint
ALTER TABLE `__new_authorRatings` RENAME TO `authorRatings`;--> statement-breakpoint
CREATE UNIQUE INDEX `user_author_rating_unique` ON `authorRatings` (`user_id`,`author_id`);--> statement-breakpoint
CREATE TABLE `__new_bookLists` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`user_id` integer NOT NULL,
	`is_public` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_bookLists`("id", "name", "description", "user_id", "is_public", "created_at", "updated_at") SELECT "id", "name", "description", "user_id", "is_public", "created_at", "updated_at" FROM `bookLists`;--> statement-breakpoint
DROP TABLE `bookLists`;--> statement-breakpoint
ALTER TABLE `__new_bookLists` RENAME TO `bookLists`;--> statement-breakpoint
CREATE TABLE `__new_bookRatings` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`book_id` integer NOT NULL,
	`rating` integer NOT NULL,
	`review` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_bookRatings`("id", "user_id", "book_id", "rating", "review", "created_at", "updated_at") SELECT "id", "user_id", "book_id", "rating", "review", "created_at", "updated_at" FROM `bookRatings`;--> statement-breakpoint
DROP TABLE `bookRatings`;--> statement-breakpoint
ALTER TABLE `__new_bookRatings` RENAME TO `bookRatings`;--> statement-breakpoint
CREATE UNIQUE INDEX `user_book_rating_unique` ON `bookRatings` (`user_id`,`book_id`);--> statement-breakpoint
CREATE TABLE `__new_books_to_genre` (
	`book_id` integer NOT NULL,
	`genre_id` integer NOT NULL,
	PRIMARY KEY(`genre_id`, `genre_id`),
	FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`genre_id`) REFERENCES `genre`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_books_to_genre`("book_id", "genre_id") SELECT "book_id", "genre_id" FROM `books_to_genre`;--> statement-breakpoint
DROP TABLE `books_to_genre`;--> statement-breakpoint
ALTER TABLE `__new_books_to_genre` RENAME TO `books_to_genre`;--> statement-breakpoint
CREATE TABLE `__new_books_to_lists` (
	`book_id` integer NOT NULL,
	`list_id` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`notes` text,
	PRIMARY KEY(`book_id`, `list_id`),
	FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`list_id`) REFERENCES `bookLists`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_books_to_lists`("book_id", "list_id", "created_at", "updated_at", "notes") SELECT "book_id", "list_id", "created_at", "updated_at", "notes" FROM `books_to_lists`;--> statement-breakpoint
DROP TABLE `books_to_lists`;--> statement-breakpoint
ALTER TABLE `__new_books_to_lists` RENAME TO `books_to_lists`;--> statement-breakpoint
CREATE TABLE `__new_chapterVersions` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`content` text NOT NULL,
	`version_number` integer NOT NULL,
	`is_currently_published` integer DEFAULT false,
	`user_book_chapter_id` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`last_published_at` text,
	FOREIGN KEY (`user_book_chapter_id`) REFERENCES `userBookChapters`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_chapterVersions`("id", "name", "content", "version_number", "is_currently_published", "user_book_chapter_id", "created_at", "last_published_at") SELECT "id", "name", "content", "version_number", "is_currently_published", "user_book_chapter_id", "created_at", "last_published_at" FROM `chapterVersions`;--> statement-breakpoint
DROP TABLE `chapterVersions`;--> statement-breakpoint
ALTER TABLE `__new_chapterVersions` RENAME TO `chapterVersions`;--> statement-breakpoint
CREATE TABLE `__new_userBookChapters` (
	`id` integer PRIMARY KEY NOT NULL,
	`number` integer NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`user_book_id` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_book_id`) REFERENCES `userBooks`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_userBookChapters`("id", "number", "title", "content", "user_book_id", "created_at", "updated_at") SELECT "id", "number", "title", "content", "user_book_id", "created_at", "updated_at" FROM `userBookChapters`;--> statement-breakpoint
DROP TABLE `userBookChapters`;--> statement-breakpoint
ALTER TABLE `__new_userBookChapters` RENAME TO `userBookChapters`;--> statement-breakpoint
CREATE TABLE `__new_userBooks` (
	`id` integer PRIMARY KEY NOT NULL,
	`slug` text,
	`title` text NOT NULL,
	`description` text,
	`cover_image_url` text,
	`user_id` integer NOT NULL,
	`is_public` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_userBooks`("id", "slug", "title", "description", "cover_image_url", "user_id", "is_public", "created_at", "updated_at") SELECT "id", "slug", "title", "description", "cover_image_url", "user_id", "is_public", "created_at", "updated_at" FROM `userBooks`;--> statement-breakpoint
DROP TABLE `userBooks`;--> statement-breakpoint
ALTER TABLE `__new_userBooks` RENAME TO `userBooks`;--> statement-breakpoint
CREATE UNIQUE INDEX `userBooks_slug_unique` ON `userBooks` (`slug`);--> statement-breakpoint
CREATE TABLE `__new_userBooks_to_genre` (
	`user_book_id` integer NOT NULL,
	`genre_id` integer NOT NULL,
	PRIMARY KEY(`user_book_id`, `genre_id`),
	FOREIGN KEY (`user_book_id`) REFERENCES `userBooks`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`genre_id`) REFERENCES `genre`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_userBooks_to_genre`("user_book_id", "genre_id") SELECT "user_book_id", "genre_id" FROM `userBooks_to_genre`;--> statement-breakpoint
DROP TABLE `userBooks_to_genre`;--> statement-breakpoint
ALTER TABLE `__new_userBooks_to_genre` RENAME TO `userBooks_to_genre`;--> statement-breakpoint
CREATE TABLE `__new_userLikedArticles` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`article_id` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`article_id`) REFERENCES `articles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_userLikedArticles`("id", "user_id", "article_id", "created_at") SELECT "id", "user_id", "article_id", "created_at" FROM `userLikedArticles`;--> statement-breakpoint
DROP TABLE `userLikedArticles`;--> statement-breakpoint
ALTER TABLE `__new_userLikedArticles` RENAME TO `userLikedArticles`;--> statement-breakpoint
CREATE TABLE `__new_userLikedAuthors` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`author_id` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`author_id`) REFERENCES `author`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_userLikedAuthors`("id", "user_id", "author_id") SELECT "id", "user_id", "author_id" FROM `userLikedAuthors`;--> statement-breakpoint
DROP TABLE `userLikedAuthors`;--> statement-breakpoint
ALTER TABLE `__new_userLikedAuthors` RENAME TO `userLikedAuthors`;--> statement-breakpoint
CREATE TABLE `__new_userLikedBooks` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`book_id` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_userLikedBooks`("id", "user_id", "book_id", "created_at") SELECT "id", "user_id", "book_id", "created_at" FROM `userLikedBooks`;--> statement-breakpoint
DROP TABLE `userLikedBooks`;--> statement-breakpoint
ALTER TABLE `__new_userLikedBooks` RENAME TO `userLikedBooks`;--> statement-breakpoint
CREATE TABLE `__new_userReadingProgress` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`book_id` integer NOT NULL,
	`last_character_index` integer NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_userReadingProgress`("id", "user_id", "book_id", "last_character_index", "updated_at") SELECT "id", "user_id", "book_id", "last_character_index", "updated_at" FROM `userReadingProgress`;--> statement-breakpoint
DROP TABLE `userReadingProgress`;--> statement-breakpoint
ALTER TABLE `__new_userReadingProgress` RENAME TO `userReadingProgress`;