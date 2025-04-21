DROP INDEX IF EXISTS "articles_slug_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "user_author_rating_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "author_slug_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "user_book_rating_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "user_sub_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "userBooks_slug_unique";--> statement-breakpoint
ALTER TABLE `userBooks` ALTER COLUMN "slug" TO "slug" text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `articles_slug_unique` ON `articles` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_author_rating_unique` ON `authorRatings` (`user_id`,`author_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `author_slug_unique` ON `author` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_book_rating_unique` ON `bookRatings` (`user_id`,`book_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_sub_unique` ON `user` (`sub`);--> statement-breakpoint
CREATE UNIQUE INDEX `userBooks_slug_unique` ON `userBooks` (`slug`);