CREATE TYPE "public"."competitor_type_enum" AS ENUM('RIDER', 'SKIER');--> statement-breakpoint
ALTER TABLE "users_table" ADD COLUMN "competitor_type" "competitor_type_enum" DEFAULT 'RIDER' NOT NULL;