ALTER TABLE "users_table" ADD COLUMN "has_seen_welcome_msg" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users_table" DROP COLUMN "has_seen_welcome";