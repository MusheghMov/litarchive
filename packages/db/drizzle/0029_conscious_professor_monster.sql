ALTER TABLE `user` ADD `firstName` text;--> statement-breakpoint
ALTER TABLE `user` ADD `lastName` text;--> statement-breakpoint
ALTER TABLE `user` ADD `email` text;--> statement-breakpoint
ALTER TABLE `user` ADD `imageUrl` text;--> statement-breakpoint
ALTER TABLE `user` ADD `createdAt` text DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `user` ADD `updatedAt` text DEFAULT CURRENT_TIMESTAMP;