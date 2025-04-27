CREATE TABLE `chapterVersions` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`content` text NOT NULL,
	`version_number` integer NOT NULL,
	`is_currently_published` integer DEFAULT false,
	`user_book_chapter_id` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`last_published_at` text,
	FOREIGN KEY (`user_book_chapter_id`) REFERENCES `userBookChapters`(`id`) ON UPDATE no action ON DELETE no action
);
