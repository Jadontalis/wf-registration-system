CREATE TABLE "registration_slots_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"status" "slot_status_enum" DEFAULT 'RESERVED' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "registration_slots_table_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "registration_slots_table" ADD CONSTRAINT "registration_slots_table_user_id_users_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "slot_user_id_idx" ON "registration_slots_table" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "slot_status_idx" ON "registration_slots_table" USING btree ("status");