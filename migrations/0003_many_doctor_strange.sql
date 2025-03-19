ALTER TABLE "users" DROP CONSTRAINT "users_password_unique";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "full_name" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_reminder_sent" timestamp with time zone;