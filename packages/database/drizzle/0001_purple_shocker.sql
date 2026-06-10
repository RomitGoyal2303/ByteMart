ALTER TABLE `products` MODIFY COLUMN `image_url` varchar(1024) NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `rating` decimal(3,2) DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE `products` ADD `reviews` int DEFAULT 0;