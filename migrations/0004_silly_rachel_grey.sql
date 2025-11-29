ALTER TABLE "users_table" ALTER COLUMN "bios" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users_table" ADD COLUMN "waiver_signed_at" timestamp with time zone;