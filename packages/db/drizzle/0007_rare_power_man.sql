ALTER TABLE user ADD `sub` text;--> statement-breakpoint
CREATE UNIQUE INDEX `user_sub_unique` ON `user` (`sub`);