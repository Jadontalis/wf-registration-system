ALTER TABLE "users_table" ALTER COLUMN "competitor_type" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users_table" ALTER COLUMN "competitor_type" SET DEFAULT 'RIDER'::text;--> statement-breakpoint
DROP TYPE "public"."competitor_type_enum";--> statement-breakpoint
CREATE TYPE "public"."competitor_type_enum" AS ENUM('RIDER', 'SKIER', 'SNOWBOARDER', 'SKIER_AND_SNOWBOARDER', 'RIDER_AND_SKIER_SNOWBOARDER');--> statement-breakpoint
ALTER TABLE "users_table" ALTER COLUMN "competitor_type" SET DEFAULT 'RIDER'::"public"."competitor_type_enum";--> statement-breakpoint
ALTER TABLE "users_table" ALTER COLUMN "competitor_type" SET DATA TYPE "public"."competitor_type_enum" USING "competitor_type"::"public"."competitor_type_enum";