ALTER TABLE `books_to_lists` RENAME COLUMN "added_at" TO "created_at";--> statement-breakpoint
ALTER TABLE `books_to_lists` ADD `updated_at` text DEFAULT CURRENT_TIMESTAMP;