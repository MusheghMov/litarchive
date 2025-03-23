CREATE TABLE `bookLists` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`user_id` integer NOT NULL,
	`is_public` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `books_to_lists` (
	`book_id` integer NOT NULL,
	`list_id` integer NOT NULL,
	`added_at` text DEFAULT CURRENT_TIMESTAMP,
	`notes` text,
	PRIMARY KEY(`book_id`, `list_id`),
	FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`list_id`) REFERENCES `bookLists`(`id`) ON UPDATE no action ON DELETE no action
);
