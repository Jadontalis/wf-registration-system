CREATE TYPE "public"."division_enum" AS ENUM('NOVICE', 'SPORT', 'OPEN');--> statement-breakpoint
ALTER TABLE "teams_table" ALTER COLUMN "horse_name" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "users_table" ADD COLUMN "guardian_name" varchar(255);--> statement-breakpoint
ALTER TABLE "users_table" ADD COLUMN "guardian_phone" varchar(20);--> statement-breakpoint
ALTER TABLE "users_table" ADD COLUMN "division" "division_enum";