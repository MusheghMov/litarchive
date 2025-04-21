CREATE TABLE `userBooks_to_genre` (
	`user_book_id` integer NOT NULL,
	`genre_id` integer NOT NULL,
	PRIMARY KEY(`user_book_id`, `genre_id`),
	FOREIGN KEY (`user_book_id`) REFERENCES `userBooks`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`genre_id`) REFERENCES `genre`(`id`) ON UPDATE no action ON DELETE no action
);
