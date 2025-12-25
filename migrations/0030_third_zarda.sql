ALTER TABLE "users_table" ALTER COLUMN "role" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users_table" ALTER COLUMN "role" SET DEFAULT 'USER'::text;--> statement-breakpoint
DROP TYPE "public"."role_enum";--> statement-breakpoint
CREATE TYPE "public"."role_enum" AS ENUM('USER', 'ADMIN', 'INVITEE');--> statement-breakpoint
ALTER TABLE "users_table" ALTER COLUMN "role" SET DEFAULT 'USER'::"public"."role_enum";--> statement-breakpoint
ALTER TABLE "users_table" ALTER COLUMN "role" SET DATA TYPE "public"."role_enum" USING "role"::"public"."role_enum";