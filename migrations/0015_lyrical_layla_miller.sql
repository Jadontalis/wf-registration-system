CREATE INDEX "slot_user_id_idx" ON "registration_slots_table" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "slot_status_idx" ON "registration_slots_table" USING btree ("status");