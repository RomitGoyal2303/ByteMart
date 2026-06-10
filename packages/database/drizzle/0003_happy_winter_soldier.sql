ALTER TABLE `addresses` DROP FOREIGN KEY `addresses_customer_id_customers_id_fk`;
--> statement-breakpoint
ALTER TABLE `addresses` ADD CONSTRAINT `addresses_customer_id_users_id_fk` FOREIGN KEY (`customer_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;