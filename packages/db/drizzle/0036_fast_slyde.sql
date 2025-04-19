CREATE TABLE `userBookChapters` (
	`id` integer PRIMARY KEY NOT NULL,
	`number` integer NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`user_book_id` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_book_id`) REFERENCES `userBooks`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `userBooks` (
	`id` integer PRIMARY KEY NOT NULL,
	`slug` text,
	`title` text NOT NULL,
	`description` text,
	`cover_image_url` text,
	`user_id` integer NOT NULL,
	`is_public` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `userBooks_slug_unique` ON `userBooks` (`slug`);