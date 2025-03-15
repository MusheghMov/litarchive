ALTER TABLE `books_to_genra` RENAME TO `books_to_genre`;--> statement-breakpoint
ALTER TABLE `genra` RENAME TO `genre`;--> statement-breakpoint
ALTER TABLE `books_to_genre` RENAME COLUMN "genra_id" TO "genre_id";--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_books_to_genre` (
	`book_id` integer NOT NULL,
	`genre_id` integer NOT NULL,
	PRIMARY KEY(`genre_id`, `genre_id`),
	FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`genre_id`) REFERENCES `genre`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_books_to_genre`("book_id", "genre_id") SELECT "book_id", "genre_id" FROM `books_to_genre`;--> statement-breakpoint
DROP TABLE `books_to_genre`;--> statement-breakpoint
ALTER TABLE `__new_books_to_genre` RENAME TO `books_to_genre`;--> statement-breakpoint
PRAGMA foreign_keys=ON;