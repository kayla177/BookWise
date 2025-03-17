ALTER TABLE "users" DROP CONSTRAINT "users_password_unique";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "full_name" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_reminder_sent" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "engagement_status" varchar(20) DEFAULT 'active';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email_preferences" jsonb DEFAULT '{"activityReminders":true,"newsletters":true,"bookRecommendations":true,"accountUpdates":true}'::jsonb;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "sign_in_count" integer DEFAULT 0;