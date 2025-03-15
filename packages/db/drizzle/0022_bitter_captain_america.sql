CREATE TABLE `books_to_genra` (
	`book_id` integer NOT NULL,
	`genra_id` integer NOT NULL,
	PRIMARY KEY(`genra_id`, `genra_id`),
	FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`genra_id`) REFERENCES `genra`(`id`) ON UPDATE no action ON DELETE no action
);
