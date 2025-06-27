CREATE TABLE `auth_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`session_token` text NOT NULL,
	`expires_at` text NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `auth_sessions_session_token_unique` ON `auth_sessions` (`session_token`);--> statement-breakpoint
CREATE INDEX `idx_auth_sessions_user_id` ON `auth_sessions` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_auth_sessions_token` ON `auth_sessions` (`session_token`);--> statement-breakpoint
CREATE INDEX `idx_auth_sessions_expires` ON `auth_sessions` (`expires_at`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`role` text DEFAULT 'admin' NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`last_login_at` text,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updated_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `idx_users_username` ON `users` (`username`);--> statement-breakpoint
CREATE INDEX `idx_users_email` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `idx_users_role` ON `users` (`role`);--> statement-breakpoint
CREATE INDEX `idx_users_active` ON `users` (`is_active`);