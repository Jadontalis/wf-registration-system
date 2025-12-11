ALTER TABLE "users_table" ALTER COLUMN "bios" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users_table" ADD COLUMN "address" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "users_table" ADD COLUMN "hometown" varchar(255);