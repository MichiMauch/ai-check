CREATE TABLE `assessment_results` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`industry` text NOT NULL,
	`company_size` text NOT NULL,
	`self_assessment` text NOT NULL,
	`calculated_level` text NOT NULL,
	`score` integer NOT NULL,
	`max_score` integer DEFAULT 75 NOT NULL,
	`answers` text NOT NULL,
	`insight` text,
	`delta` text,
	`next_steps` text,
	`ai_recommendation` text,
	`recommended_products` text,
	`email` text,
	`ip_address` text,
	`user_agent` text,
	`completion_time_ms` integer,
	`source` text DEFAULT 'web'
);

CREATE TABLE `email_leads` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`source` text DEFAULT 'assessment' NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`assessment_id` text,
	`industry` text,
	`company_size` text,
	`calculated_level` text,
	`ip_address` text,
	`user_agent` text,
	`emails_sent` integer DEFAULT 0 NOT NULL,
	`last_email_sent` text,
	FOREIGN KEY (`assessment_id`) REFERENCES `assessment_results`(`id`) ON UPDATE no action ON DELETE no action
);

CREATE TABLE `assessment_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`started_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`completed_at` text,
	`last_activity_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`current_step` text DEFAULT 'company-info' NOT NULL,
	`progress` real DEFAULT 0 NOT NULL,
	`partial_data` text,
	`assessment_result_id` text,
	`ip_address` text,
	`user_agent` text,
	FOREIGN KEY (`assessment_result_id`) REFERENCES `assessment_results`(`id`) ON UPDATE no action ON DELETE no action
);

CREATE INDEX `idx_industry` ON `assessment_results` (`industry`);
CREATE INDEX `idx_company_size` ON `assessment_results` (`company_size`);
CREATE INDEX `idx_calculated_level` ON `assessment_results` (`calculated_level`);
CREATE INDEX `idx_email` ON `assessment_results` (`email`);
CREATE INDEX `idx_created_at` ON `assessment_results` (`created_at`);

CREATE UNIQUE INDEX `email_leads_email_unique` ON `email_leads` (`email`);
CREATE INDEX `idx_email_leads_email` ON `email_leads` (`email`);
CREATE INDEX `idx_email_leads_source` ON `email_leads` (`source`);
CREATE INDEX `idx_email_leads_created_at` ON `email_leads` (`created_at`);
CREATE INDEX `idx_email_leads_status` ON `email_leads` (`status`);

CREATE INDEX `idx_sessions_started_at` ON `assessment_sessions` (`started_at`);
CREATE INDEX `idx_sessions_current_step` ON `assessment_sessions` (`current_step`);
CREATE INDEX `idx_sessions_completed_at` ON `assessment_sessions` (`completed_at`);
