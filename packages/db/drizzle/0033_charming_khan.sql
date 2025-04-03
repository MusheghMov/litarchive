ALTER TABLE `author` ADD `slug` text;--> statement-breakpoint
ALTER TABLE `author` ADD `name_original` text;--> statement-breakpoint
CREATE UNIQUE INDEX `author_slug_unique` ON `author` (`slug`);