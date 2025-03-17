-- Add new columns to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS last_reminder_sent timestamp with time zone,
ADD COLUMN IF NOT EXISTS engagement_status varchar(20) DEFAULT 'active';