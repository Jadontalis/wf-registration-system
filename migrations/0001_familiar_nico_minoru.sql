ALTER TABLE "users_table" ADD COLUMN "phone" varchar(20) DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "users_table" ADD COLUMN "waiver_signed" boolean DEFAULT false NOT NULL;