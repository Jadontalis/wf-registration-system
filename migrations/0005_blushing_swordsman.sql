CREATE TYPE "public"."slot_status_enum" AS ENUM('RESERVED', 'COMPLETED', 'EXPIRED', 'RELEASED');--> statement-breakpoint
CREATE TYPE "public"."waitlist_status_enum" AS ENUM('PENDING', 'NOTIFIED', 'EXPIRED', 'COMPLETED');--> statement-breakpoint
CREATE TABLE "registration_slots_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"status" "slot_status_enum" DEFAULT 'RESERVED' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "registration_slots_table_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "teams_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cart_id" uuid NOT NULL,
	"rider_id" uuid NOT NULL,
	"skier_id" uuid NOT NULL,
	"horse_name" varchar(255) NOT NULL,
	"status" "status_enum" DEFAULT 'PENDING' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "teams_table_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "waitlist_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"status" "waitlist_status_enum" DEFAULT 'PENDING' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "waitlist_table_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "registration_cart_table" ADD COLUMN "user_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "registration_cart_table" ADD COLUMN "status" "reg_cart_status_enum" DEFAULT 'PENDING' NOT NULL;--> statement-breakpoint
ALTER TABLE "registration_cart_table" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "registration_cart_table" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "registration_slots_table" ADD CONSTRAINT "registration_slots_table_user_id_users_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teams_table" ADD CONSTRAINT "teams_table_cart_id_registration_cart_table_id_fk" FOREIGN KEY ("cart_id") REFERENCES "public"."registration_cart_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teams_table" ADD CONSTRAINT "teams_table_rider_id_users_table_id_fk" FOREIGN KEY ("rider_id") REFERENCES "public"."users_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teams_table" ADD CONSTRAINT "teams_table_skier_id_users_table_id_fk" FOREIGN KEY ("skier_id") REFERENCES "public"."users_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "waitlist_table" ADD CONSTRAINT "waitlist_table_user_id_users_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "registration_cart_table" ADD CONSTRAINT "registration_cart_table_user_id_users_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_table"("id") ON DELETE no action ON UPDATE no action;