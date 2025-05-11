CREATE TABLE `userBookCollaborators` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_book_id` integer NOT NULL,
	`user_id` integer NOT NULL,
	`role` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_book_id`) REFERENCES `userBooks`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_book_collaborator_unique` ON `userBookCollaborators` (`user_book_id`,`user_id`);