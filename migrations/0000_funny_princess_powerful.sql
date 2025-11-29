CREATE TYPE "public"."reg_cart_status_enum" AS ENUM('APPROVED', 'PENDING', 'REJECTED');--> statement-breakpoint
CREATE TYPE "public"."role_enum" AS ENUM('USER', 'ADMIN');--> statement-breakpoint
CREATE TYPE "public"."status_enum" AS ENUM('APPROVED', 'REJECTED', 'PENDING');--> statement-breakpoint
CREATE TABLE "registration_cart_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	CONSTRAINT "registration_cart_table_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "registration_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	CONSTRAINT "registration_table_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "users_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"email" text NOT NULL,
	"bios" varchar(255) NOT NULL,
	"password" text NOT NULL,
	"status" "status_enum" DEFAULT 'PENDING' NOT NULL,
	"role" "role_enum" DEFAULT 'USER' NOT NULL,
	"last_activity_date" date DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_table_id_unique" UNIQUE("id"),
	CONSTRAINT "users_table_email_unique" UNIQUE("email"),
	CONSTRAINT "users_table_bios_unique" UNIQUE("bios")
);
