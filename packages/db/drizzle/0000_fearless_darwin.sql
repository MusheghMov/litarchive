CREATE TABLE `author` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text,
	`imageUrl` text,
	`birthDate` text,
	`deathDate` text
);
--> statement-breakpoint
CREATE TABLE `books` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text,
	`year` text,
	`fileUrl` text,
	`author_id` integer
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text,
	`email` text
);
