CREATE TABLE `userReadingProgress` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`book_id` integer NOT NULL,
	`last_character_index` integer NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON UPDATE no action ON DELETE no action
);
