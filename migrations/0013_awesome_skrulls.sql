ALTER TYPE "public"."competitor_type_enum" ADD VALUE 'RIDER_AND_SKIER_SNOWBOARDER';--> statement-breakpoint
ALTER TABLE "users_table" RENAME COLUMN "hometown" TO "state";--> statement-breakpoint
ALTER TABLE "users_table" ADD COLUMN "city" varchar(255) DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "users_table" ADD COLUMN "zip" varchar(20) DEFAULT '' NOT NULL;